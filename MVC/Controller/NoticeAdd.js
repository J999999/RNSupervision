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
import {height, unitWidth} from '../Tools/ScreenAdaptation';
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
class NoticeAdd  extends React.Component {

    constructor(props){
        super(props);
        this.title = "";
        this.content = "";
        this.fileList = [];
        this.fileUrlList =[];
        this.bean = null;

        navigation = this.props.navigation;
        this.state = {
            selectValue: '',
            deptData: [],
            hasAttach:false,
        }
     }

     componentDidMount(): void {
        this._getDeptInfo();
        if(this.bean!=null){
            this.getNoticeInfo()
        }
     }
    _getDeptInfo () {
        HttpPost(URLS.SmsGetDeptUser,{},"").then((response)=>{
            if(response.result === 1){
                this.setState({ deptData: response.data })
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }
    getNoticeInfo(){
        HttpPost(URLS.NoticeDetail,{id:this.bean.id},"").then((response)=>{
            // RRCToast.show(response.msg);
            if(response.result == 1){
                this.bean = response.data
                this.fileUrlList=this.bean.fileList
                this.setState({
                    hasAttach:true
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    uploadNoticeInfo=(files)=> {
        let filesss = this.fileUrlList&&this.fileUrlList.length>0 ? this.fileUrlList :[]
        filesss = filesss.concat(files)
        console.log(filesss)
        let requestData = {"title":this.title,"content":this.content,"fileList":filesss};
        if(this.bean !=null){
            requestData['id']= this.bean.id
        }
        HttpPost(URLS.AddNotice,requestData,"正在保存..").then((response)=>{
            RRCToast.show(response.msg);
            if(response.result === 1){
                navigation.state.params.callback()
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

                for(let i in this.fileList){
                    if(this.fileList[i].uri == response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                if(!response.fileName){
                    response.fileName = response.uri.substring(response.uri.lastIndexOf("/")+1);
                }

                this.fileList.push(response);
                this.setState({
                    hasAttach:true,
                });
            }
        });

    };

    _pressDelAttach = (item,type)=>{
        let has = false;

        if(type === 0){
            for(let i in this.fileList){
                if(this.fileList[i] == item){
                    this.fileList.pop(item);
                    has = true;
                }
            }
        }
        if(type === 1){
            for(let i in this.fileUrlList){
                if(this.fileUrlList[i] == item){
                    this.fileUrlList.pop(item);
                    has = true;
                }
            }
        }

        if(has){
            if(this.fileList.length>0 || this.fileUrlList.length>0){
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
        if(attachItem.uri===undefined){
            attachItem.uri = attachItem.url
        }
        navigation.navigate('AttachDetail',{item : attachItem});
    }

    static  navigationOptions = ({navigation}) =>({
        title: (navigation.state.params && navigation.state.params.bean )?'修改':'新增',
    });


    render(){
        const  {params} = this.props.navigation.state;
        if(this.bean==null && params && params.bean){
            this.bean  = params.bean
            this.title = params.bean.title
            this.content = params.bean.content
        }

        var fileButtons = [] ;

        for(let i in this.fileList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileList[i],0);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileList[i];
                            NoticeAdd._pressDetail();
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        } ;


        for(let j in this.fileUrlList){
            var buttonUrl = (
                <View
                    key = {j}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileUrlList[j].name} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileUrlList[j],1);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileUrlList[j];
                            NoticeAdd._pressDetail();
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(buttonUrl);
        }

        return (
            <View style = {styles.all}>
            <KeyboardAwareScrollView style = {styles.all}>

                <View style={styles.edit}>

                    <TextInputWidget  defaultValue={this.bean!=null ? this.bean.title :''}  title='标    题：'  placeholder='请输入' onChangeText={(text)=>{
                            this.title = text;
                    }}/>
                    <TextInputMultWidget defaultValue={ this.bean!=null  ?  this.bean.content :''}  title='内    容：'  placeholder='请输入' onChangeText={(text)=>{
                            this.content = text;
                    }}/>
                    <TouchableOpacity onPress={()=>{
                        this.props.navigation.navigate('EmpSelectList', {data:this.state.deptData,value:this.state.selectValue,callback:function (select) {
                                console.log('.......... ', select);
                            }})
                    }}>
                        <TextInputMultWidget defaultValue={ this.bean!=null  ?  this.bean.content :''}  title='下发对象：'  placeholder='请选择下发对象' onChangeText={(text)=>{
                            this.content = text;
                        }}/>
                    </TouchableOpacity>
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
        margin:8*unitWidth,
        alignItems:'flex-end',
        width:screenWidth-16*unitWidth,
    },

    buttonText:{
        fontSize:18*unitWidth,
        color:'#FFF',
        padding:12*unitWidth,
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
        marginLeft:10*unitWidth,
        marginTop:15*unitWidth,
        marginBottom:15*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
    },

    rightIcon:{
        margin: 10*unitWidth,
    },

    delete:{
        width:30*unitWidth,
        height:29*unitWidth,
    },
})


module.exports = NoticeAdd
