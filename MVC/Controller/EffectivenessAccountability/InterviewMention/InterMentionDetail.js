import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Button, TextInput} from 'react-native';
import {screenWidth, unitWidth} from "../../../Tools/ScreenAdaptation";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../../../Widget/TextFileSelectWidget";
import JQAlertBottomView from '../../../View/JQAlertBottomView';
import DataPicker from 'react-native-datepicker'
import {HttpPost, HttpPostFile} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import ImagePicker from "react-native-image-picker";
import OpenFile from 'react-native-doc-viewer';

//附件弹出框选项
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

var sourceTypeStr = '';
var releaseTypeStr = '';
var _that;
export default class InterMentionDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '约谈提起详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'更多'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        RRCAlert.alert('请选择','',
            [
                {text:'审批流程', style:{color:'#38ADFF', fontWeight: 'bold'}},
                {text:'系统记录', style:{color:'#38ADFF', fontWeight: 'bold'}},
                {text: '取消', style: {color: '#38ADFF', fontWeight: 'bold'}},
            ], this._checkAction.bind(this));
    };
    _checkAction(index){
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        if (index === 0){
            navigation.navigate('IMApprovalProcess',{approvalLogList: _that.state.approvalLogList})
        } else if (index === 1){
            navigation.navigate('IMSystemRecording',{dataLogList:_that.state.dataLogList})
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let buttons = navigation.getParam('buttons');
        this.setState({buttons: buttons});
        HttpPost(URLS.InterMentionDetailApi, {id:id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            let model = response.data;
            this.setState({
                id : id,
                sourceStr: model.sourceStr,
                matter: model.matter,
                situation: model.situation,
                interviewList: model.interviewList,
                filesList: model.filesList ? model.filesList : [],
                approvalReportTime: model.approvalReportTime,
                createTime: model.createTime,
                approvalLogList: model.approvalLogList,
                dataLogList: model.dataLogList,
            });
        }).catch((err)=>{
            console.log(err);
        })
    }
    constructor (props) {
        super(props);
        _that = this;
        this.state = {
            id: '',                    // 提交修改时，需要用到
            enabledEdit: false,        // 页面中组件是否可编辑
            xgIdentifier: '修改',       // 修改按钮标识，修改时: 可编辑   提交修改: 可上传
            buttons: [],               // 可操作按钮
            sourceStr: '',              // 来源
            matter: '',                 // 事由。
            situation: '',              // 主要情况
            interviewList: [],          // 约谈对象
            filesList: [],              //  附件  非必填
            approvalReportTime: '',             // 提交审核时间
            createTime: '',             // 创建时间
            approvalLogList: [],        // 审批流程
            dataLogList: [],            // 系统记录
        };
    }
    render(): React.ReactNode {
        var fileButtons = [] ;
        var ss = [];

        this.state.filesList.map((i, key) => {
            let nameStr = i.name ? i.name : i.fileName;
            var button = (
                <View
                    key={key}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(i);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(i)
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        });

        for (let j=0; j<this.state.interviewList.length; j++){
            var aa = (
                <View style={{flexDirection: 'row', height: 94*unitWidth, alignItems: 'center', borderBottomWidth: unitWidth , borderColor: '#F4F4F4'}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333', marginLeft: 15*unitWidth}}>
                        {j === 0 ? '约谈对象:' : ''}
                    </Text>
                    <View style={{width: 245*unitWidth}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 44*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth, color: '#333'}}>单位:</Text>
                            <TextInput numberOfLines={1}
                                       editable={this.state.enabledEdit}
                                       underlineColorAndroid='transparent'
                                       value={this.state.interviewList[j].deptName}
                                       placeholder = {'请输入单位名称'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['deptName'] : text} : item)
                                       })}}
                            />
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 44*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth, color: '#333'}}>职务:</Text>
                            <TextInput numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                       editable={this.state.enabledEdit}
                                       value={this.state.interviewList[j].dutyName}
                                       placeholder = {'请输入职务名称'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['dutyName'] : text} : item)
                                       })}}
                            />
                            <Text style={{fontSize: 15*unitWidth, marginLeft: 10*unitWidth, color: '#333'}}>姓名:</Text>
                            <TextInput numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                       editable={this.state.enabledEdit}
                                       value={this.state.interviewList[j].staffName}
                                       placeholder = {'请输入姓名'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['staffName'] : text} : item)
                                       })}}
                            />
                        </View>
                    </View>
                </View>
            );
            ss.push(aa);
        }
        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.sourceStr}  title='来源:'  placeholder='请输入来源描述' onChangeText={(text)=>{
                    this.setState({sourceStr: text});
                }}/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.matter}  title='事由:'  placeholder='请输入事由描述' onChangeText={(text)=>{
                    this.setState({matter: text});
                }}/>
                {ss}
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.approvalReportTime}  title='提交时间:'  placeholder='请输入提交时间' onChangeText={(text)=>{
                    this.setState({approvalReportTime: text});
                }}/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.createTime}  title='创建时间:'  placeholder='请输入创建时间' onChangeText={(text)=>{
                    this.setState({createTime: text});
                }}/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.situation} title='主要情况:'  placeholder='请输入主要情况' onChangeText={(text)=>{
                    this.setState({situation: text});
                }}/>
                {
                    this.state.userDeptName?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userDeptName} title='提交科室:' placeholder='请输入提交科室' onChangeText={(text)=>{this.setState({userDeptName: text});}}/> : null
                }
                {
                    this.state.userName?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName} title='提交人:' placeholder='请输入提交人' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.filesList.length > 0 ?  fileButtons  :  null
                }
                {/*<TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>*/}
                {
                    this.state.buttons && this.state.buttons.map((i)=>{
                        return (
                            i.title === '查看' ? null :
                            <TouchableOpacity style={styles.button} onPress={()=>this.pressSumbit(i.name)} >
                                <Text style={styles.buttonText}>
                                    {i.title}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </KeyboardAwareScrollView>
        )
    }

    takePicture = async function() {

        if (this.state.enabledEdit === false){
            return;
        }

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

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
                for(let i in this.state.filesList){
                    if(this.state.filesList[i].uri === response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                let tempArr = [];
                tempArr = tempArr.concat(this.state.filesList);
                let index = response.uri.indexOf('/images/') + 8;
                response['fileName'] = response.uri.substr(index, response.uri.length - index);
                tempArr.push(response);

                this.setState({
                    filesList: tempArr,
                    hasAttach:true,
                });
            }
        });
    };
    _pressDelAttach = (item)=>{
        if (this.state.enabledEdit === false){
            return;
        }
        let has = false;
        for(let i in this.state.filesList){
            if(this.state.filesList[i] === item){
                this.state.filesList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.state.filesList.length>0){
                this.setState({
                    hasAttach:true
                });
            }else{
                this.setState({
                    hasAttach:false,
                });
            }
        }
    };
    _pressDetail = (attachItem)=> {
        if (attachItem.uri) {
            this.props.navigation.navigate('AttachDetail',{item : attachItem})
        } else {
            if (Platform.OS === 'ios') {
                OpenFile.openDoc([{
                    url: URLS.FileHost + attachItem.url,
                    fileNameOptional: attachItem.name
                }], (error, url)=>{

                })
            }else {
                let uriSuffix = attachItem.url.substr(attachItem.url.lastIndexOf(".")+1).toLowerCase();
                OpenFile.openDoc([{
                    url: URLS.FileHost + attachItem.url,
                    fileName: attachItem.name,
                    fileType: uriSuffix,
                    cache: true,
                }], (error, uri)=>{
                })
            }
        }
    };

    async pressSumbit (type) {
        if(this.state.sourceType === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.billCode === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.situation === ''){
            RRCToast.show('请输入约谈内容');
            return;
        }
        if(this.state.processingResults === ''){
            RRCToast.show('请输入办理结果');
            return;
        }
        if (this.state.keywordStr === ''){
            RRCToast.show('请输入关键字');
            return;
        }
        if (this.state.releaseType === '1' && this.state.visualRangeList.length === 0) {
            RRCToast.show('请选择可视范围');
            return;
        }
        if (this.state.sourceType === '1'){
            if(this.state.userName === ''){
                RRCToast.show('请输入提交人');
                return;
            }
            if(this.state.userDeptName === ''){
                RRCToast.show('请输入提交科室');
                return;
            }
            if(this.state.reportTimeStr === ''){
                RRCToast.show('请输入提交时间');
                return;
            }
        }
        if (this.state.sourceType === '2'){
            if(this.state.userName === ''){
                RRCToast.show('请输入交办领导');
                return;
            }
        }
        if (this.state.sourceType === '3'){
            if(this.state.userName === ''){
                RRCToast.show('请输入交办人');
                return;
            }
        }
        if(this.state.reportTimeStr === ''){
            RRCToast.show('请输入交办时间');
            return;
        }
        if (type === 'EDIT' && this.state.enabledEdit === false){
            this.setState({enabledEdit: true});
            return;
        }
        if (type === 'EDIT'){
            try {
                var files = [];
                var reFiles = [];
                if(this.state.filesList &&  this.state.filesList.length>0){
                    var formData = new FormData();
                    for(let i  in this.state.filesList){
                        let file = {uri:this.state.filesList[i].uri,type:'multipart/form-data',name:this.state.filesList[i].fileName};
                        formData.append('files',file);
                    }
                    let res = await HttpPostFile(URLS.FileUploads,formData,"正在上传文件..");
                    files = await res.data;
                }
                if (this.state.reFilesList && this.state.reFilesList.length > 0) {
                    let reFormData = new FormData();
                    for (let i = 0; i < this.state.reFilesList.length; i++){
                        let file = {uri:this.state.reFilesList[i].uri,type:'multipart/form-data',name:this.state.reFilesList[i].fileName};
                        reFormData.append('files',file);
                    }
                    let res = await HttpPostFile(URLS.FileUploads,reFormData,"正在上传文件..");
                    reFiles = await res.data;
                }
                this.uploadNoticeInfo(files, reFiles, type);

            } catch (e) {
                console.error(e);
            }
        } else {
            this.uploadNoticeInfo([],[],type);
        }

    }

    uploadNoticeInfo=(files, reFiles, type)=> {
        if (type === 'EDIT'){
            let requestData = {};
            requestData = this.state;
            requestData['filesList'] = files;
            requestData['reFilesList'] = reFiles;
            requestData['recordType'] = 1;// 1，约谈  2，问责
            HttpPost(URLS.ModifyIAImplementInfo,requestData,"正在保存..").then((response)=>{
                RRCToast.show(response.msg);
                if(response.result === 1){
                    this.setState({enabledEdit: false});
                    this.props.navigation.goBack();
                }
            }).catch((err)=>{
                RRCAlert.alert(err);
            });
        } else if (type === 'APPLYRELEASE' && this.state.enabledEdit === false) {
            //提请审核
            HttpPost(URLS.ApplyReleaseInfo,{id: this.props.navigation.getParam('id')},"正在提交审核...").then((response)=>{
                RRCToast.show(response.msg);
                if(response.result === 1){
                    this.setState({enabledEdit: false});
                    this.props.navigation.goBack();
                }
            }).catch((err)=>{
                RRCAlert.alert(err);
            });
        } else if (type === 'RELEASE' && this.state.enabledEdit === false) {
            HttpPost(URLS.ReleaseInfo,{id: this.props.navigation.getParam('id')},"正在发布...").then((response)=>{
                RRCToast.show(response.msg);
                if(response.result === 1){
                    this.setState({enabledEdit: false});
                    this.props.navigation.goBack();
                }
            }).catch((err)=>{
                RRCAlert.alert(err);
            });
        } else if (type === 'RECALL' && this.state.enabledEdit === false) {
            this.props.navigation.navigate('RecallOption', {ids: this.props.navigation.getParam('id')});
        } else if (type === 'DELETE' && this.state.enabledEdit === false) {
            HttpPost(URLS.InterMentionDelete,{id: this.props.navigation.getParam('id')},"正在删除...").then((response)=>{
                RRCToast.show(response.msg);
                if(response.result === 1){
                    this.setState({enabledEdit: false});
                    this.props.navigation.goBack();
                }
            }).catch((err)=>{
                RRCAlert.alert(err);
            });
        }
    };
};
const styles = StyleSheet.create({
    button:{
        margin: 8*unitWidth,
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
        borderRadius:5*unitWidth,
    },
    attach:{
        width:screenWidth,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'center',
        // justifyContent:'space-between',
        borderBottomWidth: unitWidth,
        borderColor:'#F4F4F4',//需要标色
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
});
