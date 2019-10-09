import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Image, Dimensions, PixelRatio, TouchableOpacity, TouchableWithoutFeedback,
} from 'react-native';
import TextInputWidget from "../Widget/TextInputWidget";
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../Widget/TextFileSelectWidget";
import {height, unitWidth} from '../Tools/ScreenAdaptation';
import ImagePicker from 'react-native-image-picker' ;
import URLS from '../Tools/InterfaceApi';
import {HttpPost, HttpPostFile} from '../Tools/JQFetch';
import {RRCToast} from 'react-native-overlayer/src';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view/index';
import TextSelectWidget from '../Widget/TextSelectWidget';
import DataDictionary from '../Tools/DataDictionary';
import Picker from 'react-native-picker';

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
 * 新增  工作汇报
 */
class WorkReportAdd  extends React.Component {

    workReport={
        "approveState": '',
        "approveTime": "",
        "approveUserId": '',
        "approveUserName": "",
        "fileList": [],
        "files": "",
        "id": '',
        "projectId": '',
        "projectName": "string",
        "recordType": '',
        "replyList": [],
        "reportContent": "",
        "reportNode": "",
        "reportTime": "",
        "reportTitle": "",
        "reportType": '',
        "reportUnit": '',
        "reportUnitName": "",
        "reportUserId": '',
        "reportUserName": "",
        "suggestion": "",
    };

    constructor(props){
        super(props);
        this.fileList = [];
        this.fileUrlList =[];
        navigation = this.props.navigation;
        this.workReportType = {
            1:'进度汇报',
            2:'完成汇报',
        };
        this.state = {
            bean: null,
            timeNodes:[],
            hasAttach:false,
            isShowPick:false
        }
     }

    componentDidMount(): void {
         const  {params} = this.props.navigation.state;
        if(params.bean.id){
            this.workReport = params.bean
            this.fileUrlList = params.bean.fileList
            this.setState({
                hasAttach :true
            })
        }
         this.setState({
             bean : params.bean
         })

        this.getTimeNode(params.bean)
    }

    getTimeNode=(bean)=>{
        if(bean == null) return

        HttpPost(URLS.WorkReportTimeNodes,{projectId:bean.projectId},"").then((response)=>{
            if(response.result == 1){
                this.setState({
                    timeNodes:response.data
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    uploadInfo=(files)=> {

        let filesss = this.fileUrlList&&this.fileUrlList.length>0 ? this.fileUrlList :[]
        filesss = filesss.concat(files)

        if(this.workReport.id == ''){
            this.workReport.projectId = this.state.bean.projectId
            this.workReport.projectName = this.state.bean.projectName
            this.workReport.reportType = 2
        }
        this.workReport.fileList= filesss

        HttpPost(URLS.SaveWorkReport,this.workReport,"正在提交..").then((response)=>{
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

        if(this.workReport.reportType==""){
            RRCToast.show("请选择汇报类型");
            return ;
        }

        if(this.workReport.reportNode == ""){
            RRCToast.show("请选择汇报节点");
            return ;
        }

        if(this.workReport.reportTitle == ""){
            RRCToast.show("请输入汇报标题");
            return ;
        }

        if(this.workReport.reportContent == ""){
            RRCToast.show("请输入汇报内容");
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

        if(type === 1){
            for(let i in this.fileUrlList){
                if(this.fileUrlList[i] == item){
                    this.fileUrlList.pop(item);
                    has = true;
                }
            }
        }
        if(has){
            if(this.fileList.length>0  || this.fileUrlList.length>0){
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

    _pressDetail = ()=> {
        if(attachItem.uri===undefined){
            attachItem.uri = attachItem.url
        }
        navigation.navigate('AttachDetail',{item : attachItem});
    }

    static  navigationOptions = ({navigation}) =>({
        title:  navigation.state.params.title,
    });

    showPicker=(listData,param)=>{
        let list = []
        for (let i in listData){
            list.push(listData[i])
        }

        this.setState({
            isShowPick:true
        })
        Picker.init({
            pickerData: list,
            selectedValue: [list[0]],
            pickerCancelBtnText: "取消",
            pickerConfirmBtnText: "确定",
            pickerTitleText: "",
            onPickerConfirm:
                data => {
                    if(this.workReport!=null){
                        if(param == 'reportNode'){
                            this.workReport[param] = data[0]
                        }else{
                            this.workReport[param] = DataDictionary.getIndexValue(list,data)+1
                        }
                    }
                    this.setState({
                        isShowPick:false
                    })
                },
            onPickerCancel:
                data => {
                    this.setState({
                        isShowPick:false
                    })
                },
            onPickerSelect:
                data => {
                }
        });
        Picker.show();
    }

    static  navigationOptions = ({navigation}) =>({
        title: (navigation.state.params && navigation.state.params.bean.id )?'修改':'新增',
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
                            this._pressDetail();
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

                    <TextInputWidget  title='事项名称：' defaultValue={ this.state.bean!=null ? this.state.bean.projectName :'' }  placeholder='请输入' onChangeText={(text)=>{
                            // this.workReport.projectName = text;
                    }}
                                      editable = {true}
                    />

                    <TextSelectWidget title='汇报类型：' placehodler='请选择' value = {this.workReportType[this.workReport.reportType] }
                        onPress={()=>{this.showPicker(this.workReportType,'reportType') }}
                    />

                    <TextSelectWidget title='汇报节点：' placehodler='请选择'  value={ this.workReport.reportNode}
                                      onPress={()=>{ this.showPicker(this.state.timeNodes,'reportNode')
                                      }}/>

                    <TextInputWidget  defaultValue={ this.workReport!=null ? this.workReport.reportTitle :'' }  title='汇报标题：'  placeholder='请输入' onChangeText={(text)=>{
                        this.workReport.reportTitle = text;
                    }}/>

                    <TextInputMultWidget  defaultValue={ this.workReport!=null ? this.workReport.reportContent :'' }  title='汇报内容：'  placeholder='请输入' onChangeText={(text)=>{
                        this.workReport.reportContent = text;
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

                {this.state.isShowPick && <TouchableWithoutFeedback
                    onPress={() => {
                        Picker.hide();
                        this.setState({
                            isShowPick:false
                        })
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}></View>
                </TouchableWithoutFeedback>}

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


module.exports = WorkReportAdd
