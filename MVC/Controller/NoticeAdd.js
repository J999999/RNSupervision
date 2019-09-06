import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image, Dimensions, PixelRatio, TouchableOpacity
} from 'react-native';
import TextInputWidget from "../Widget/TextInputWidget";
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../Widget/TextFileSelectWidget";
import {height} from '../Tools/ScreenAdaptation'
import ImagePicker from 'react-native-image-picker' ;
import URLS from '../Tools/InterfaceApi';
import {HttpPost, HttpPostFile} from '../Tools/JQFetch';
import {RRCToast} from 'react-native-overlayer/src';
import {KeyboardAwareScrollView} from  'react-native-keyboard-aware-scroll-view';

var options = {
    title: '选择文件',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'本地选择',
    cancelButtonTitle:'取消',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

var screenWidth = Dimensions.get('window').width;
var navigation = null;
var attachItem = null;
var bean = null;
class NewsAdd  extends React.Component {

    constructor(props){
        super(props);
        this.title = "";
        this.content = "";
        this.fileList = [];
        navigation = this.props.navigation;
        this.state = {
            hasAttach:false,
        }
     }

    uploadNoticeInfo=(files)=> {
        let requestData = {"title":this.title,"content":this.content,"fileList":files};
        HttpPost(URLS.AddNotice,requestData,"正在保存..").then((response)=>{
            RRCToast.show(response.msg);
            if(response.result == 1){
                navigation.goBack();
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    _pressSumbit =()=> {

        if(this.title==""){
            RRCToast.show("请输入标题");
            return;
        }

        if(this.content==""){
            RRCToast.show("请输入内容");
            return ;
        }

        var files = []

        if(this.fileList &&  this.fileList.length>0){
            var formData = new FormData();
            for(let i  in this.fileList){
                let file = {uri:this.fileList[i].uri,type:'multipart/form-data',name:this.fileList[i].fileName};
                formData.append('files',file);
            }

             HttpPostFile(URLS.FileUploads,formData,"正在上传文件..").then((response)=>{
                if(response.result == 1){
                    files = response.data
                    this.uploadNoticeInfo(files)
                 }else{
                    alert(response.msg);
                }

            }).catch((error)=>{
                RRCToast.show(err);
            });
        }else{
            this.uploadNoticeInfo([])
        }


    };



    takePicture = async function() {

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                let source = { uri: response.uri };

                for(let i in this.fileList){
                    if(this.fileList[i].uri == response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }

                this.fileList.push(response);
                this.setState({
                    hasAttach:true,
                });
            }
        });

    };

    _pressDelAttach = (item)=>{
        let has = false;
        for(let i in this.fileList){
            if(this.fileList[i] == item){
                this.fileList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.fileList.length>0){
                this.setState({
                    hasAttach:true
                });
            }else{
                this.setState({
                    hasAttach:false,
                });
            }
        }
    }


    static  _pressDetail = ()=> {
        navigation.navigate('AttachDetail',{item : attachItem});
    }

    unique6(arr){
        var res = [];
        res = arr.filter(function(item){
            return res.includes(item) ? '' : res.push(item);
        });
        return res;
    }

    static  navigationOptions = ({navigation}) =>({
        title: '新增',

    });

    render(){
        const  {params} = this.props.navigation.state;

        var fileButtons = [] ;

        for(let i in this.fileList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileList[i];
                            console.log(attachItem);
                            NewsAdd._pressDetail();
                        }}   />
                    </View>
                </View>
            );

            fileButtons.push(button);
        } ;



        return (
            <View style = {styles.all}>
            <KeyboardAwareScrollView style = {styles.all}>

                <View style={styles.edit}>

                    <TextInputWidget  defaultValue={params && params.bean!== undefined ? params.bean.title :''}  title='标    题：'  placeholder='请输入' onChangeText={(text)=>{
                            this.title = text;
                    }}/>
                    <TextInputMultWidget defaultValue={params && params.bean!== undefined ? params.bean.content :''}  title='内    容：'  placeholder='请输入' onChangeText={(text)=>{
                            this.content = text;
                    }}/>

                    {
                        this.state.hasAttach == true ?  fileButtons  :  null
                    }

                    <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>

                </View>



            </KeyboardAwareScrollView>

                <TouchableOpacity style={styles.button}    onPress={this._pressSumbit} >
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#ffffff',
     },

    edit:{
      flex:1,
    },

    button:{
        margin:8,
        alignItems:'flex-end',
        width:screenWidth-16,
    },

    buttonText:{
        fontSize:18,
        color:'#FFF',
        padding:12,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5,
    },

    attach:{
        width:screenWidth,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'center',
        // justifyContent:'space-between',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    attachText:{
        flex:1,
        marginLeft:10,
        marginTop:15,
        marginBottom:15,
        fontSize: 15,
        color: '#333',
    },

    rightIcon:{
        margin: 10,
    },

    delete:{
        width:30,
        height:29,
    },


})


const selectStyles = {
    rowContainer: {
        backgroundColor: '#FFF',
        width:screenWidth,
    },
    row: {
        flexDirection: 'row',
        height: 55,
        alignItems: 'center',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    textInputTitle: {
        width: 80,
        fontSize: 15,
        color: '#333',
        marginLeft: 15,
    },

    textInputEdit:{
        alignSelf:'center',
        paddingRight: 10,
    },

}



module.exports = NewsAdd