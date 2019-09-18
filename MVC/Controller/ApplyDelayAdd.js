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
import TextDateSelectWidget from '../Widget/TextDateSelectWidget';

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

/**
 * 新增  约谈申请
 *     申请约谈
 */
class ApplyInterviewAdd  extends React.Component {

    constructor(props){
        super(props);
        // this.title = "";
        this.content = "";
        this.fileList = [];

        this.bean = null;

        navigation = this.props.navigation;
        this.state = {
            delayTime:'',
            finishTime:'',
            hasAttach:false,
        }
     }

     componentDidMount(): void {
         const  {params} = this.props.navigation.state;
         this.setState({
             finishTime : params.finishTime
         })
     }


    uploadInfo=(files)=> {

        const {navigation} = this.props;
        let id = navigation.getParam('id');

        //recordType 申请类型，1-延期，2-约谈，3-问责
        let requestData = { "delayedReasons":this.content,"fileList":files.join(','),projectId:id,recordType:1,delayedFinishTimeStr:this.state.delayTime,projectFinishTime:this.state.finishTime};

        HttpPost(navigation.getParam('url'),requestData,"正在提交..").then((response)=>{
            RRCToast.show(response.msg);
            if(response.result == 1){
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

        if(this.content==""){
            RRCToast.show("请输入延期原因");
            return ;
        }

        if(this.state.delay == ""){
            RRCToast.show("请选择延期时间");
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
                    this.uploadInfo(files)
                 }else{
                    alert(response.msg);
                }

            }).catch((error)=>{
                RRCToast.show(err);
            });
        }else{
            this.uploadInfo([])
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


        if(has){
            if(this.fileList.length>0  ){
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
        title:  navigation.state.params.title,
    });


    render(){


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
                            this._pressDetail();
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


                    <TextInputMultWidget  title='延期原因：'  placeholder='请输入' onChangeText={(text)=>{
                            this.content = text;
                    }}/>

                    {/*<TextDateSelectWidget title='原时间：' placehodler='请选择'  date={this.state.finishTime}*/}
                    {/*                      onDateChange={(date)=>{*/}
                    {/*                          // this.bean.assignTime = date*/}
                    {/*                      }}/>*/}

                    <TextInputWidget    title='原完成时间'  defaultValue={ this.state.finishTime} editable={ false} />
                    <TextDateSelectWidget title='延期至：' placehodler='请选择'  date={this.state.delayTime}
                                          onDateChange={(date)=>{
                                              this.state.delayTime = date
                                          }}/>
                    {/*<TextInputWidget    title='编辑人：'  placeholder='请输入' onChangeText={(text)=>{*/}
                    {/*    this.title = text;*/}
                    {/*}}/>*/}
                    {/*<TextDateSelectWidget title='编辑时间：' placehodler='请选择'  date={this.bean!=null ? this.bean.assignTime :''}*/}
                    {/*                      onDateChange={(date)=>{*/}
                    {/*                          this.bean.assignTime = date*/}
                    {/*                      }}/>*/}

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


module.exports = ApplyInterviewAdd
