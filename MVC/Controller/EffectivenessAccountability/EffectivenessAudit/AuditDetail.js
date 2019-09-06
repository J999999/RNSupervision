import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Button} from 'react-native';
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

export default class AuditDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '审核详情',
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
                {text:'呈批表', style:{color:'#38ADFF', fontWeight: 'bold'}},
                {text: '取消', style: {color: '#38ADFF', fontWeight: 'bold'}},
            ], this._checkAction.bind(this));
    };
    _checkAction(index){
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        if (index === 0){
            navigation.navigate('ApprovalProcess',{id:id})
        } else if (index === 1){
            navigation.navigate('SystemRecording',{id:id})
        } else if (index === 2){
            navigation.navigate('BatchForms',{id:id})
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let buttons = navigation.getParam('buttons');
        this.setState({buttons: buttons});
        HttpPost(URLS.QueryInfoById, {id:id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                let model = response['data'];
                if (model.sourceType === 1){
                    sourceTypeStr = '内部转办'
                } else if (model.sourceType === 2){
                    sourceTypeStr = '领导交办'
                } else if (model.sourceType === 3){
                    sourceTypeStr = '临时交办'
                }
                this.setState({
                    id : id,
                    billCode: model.billCode,
                    symbolCode: model.symbolCode,
                    filesList: model.filesList,
                    userName: model.userName,
                    keywordStr: model.keywordStr,
                    sourceType: model.sourceType.toString(),
                    interviewName: model.interviewName,
                    matter: model.matter,
                    situation: model.situation,
                    processingResults: model.processingResults,
                    userDeptName: model.userDeptName,
                    reportTimeStr: model.reportTime,
                    finishTimeStr: model.finishTime,
                    approvalReportTime: model.approvalReportTime,
                    approvalReportUserName: model.approvalReportUserName,
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    constructor (props) {
        super(props);
        this.state = {
            id: '',                    // 提交修改时，需要用到
            enabledEdit: false,        // 页面中组件是否可编辑
            xgIdentifier: '修改',       // 修改按钮标识，修改时: 可编辑   提交修改: 可上传
            buttons: [],               // 可操作按钮
            billCode: '',              // 编号  文本输入框，必填。
            symbolCode: '',            // 文号  文本输入框，必填。
            filesList: [],             // 附件  非必填
            userName: '',              // 提交人     文本输入框，必填。
            keywordStr: '',            // 关键字     文本输入框，必填。
            sourceType: '',            // 事项来源    底部弹出框，必选。
            interviewName: '',         // 约谈对象    文本输入框，必填。
            matter: '',                // 约谈事项    文本输入框，必填。
            situation: '',             // 约谈内容    文本输入框，必填。
            processingResults: '',     // 办理结果    文本输入框，必填。
            userDeptName: '',          // 提交科室    文本输入框，必填。
            reportTimeStr: '',         // 提交时间    日期选择框，必填。
            approvalReportTime: '',    // 提交审核时间
            approvalReportUserName: '', //提交审核人
            finishTimeStr: '',         // 约谈完成时间  日期选择框，非必填。（ 不填，提请发布审核框不可选 ）
            hasAttach:false,           // 附件相关，与上传数据无关
        };
    }
    render(): React.ReactNode {

        var fileButtons = [] ;

        for(let i in this.state.filesList){
            let nameStr = this.state.filesList[i].name ? this.state.filesList[i].name : this.state.filesList[i].fileName;
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.state.filesList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(this.state.filesList[i])
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <JQAlertBottomView leftName={'事项来源'}
                                   dataSource={
                                       [
                                           {'name':'内部转办', 'id':'1'},
                                           {'name':'领导交办', 'id':'2'},
                                           {'name':'临时交办', 'id':'3'},
                                       ]
                                   }
                                   enabledEdit={this.state.enabledEdit}
                                   alertTitle={sourceTypeStr}
                                   callBack={(item) => {
                                       this.setState({sourceType: item.id});
                                   }}
                />
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.billCode}  title='编号:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.symbolCode}  title='文号:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.interviewName}  title='审核对象:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.matter} title='审核事项:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.situation} title='审核内容:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.processingResults} title='办理结果:'/>
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'完成时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.finishTimeStr}
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled={!this.state.enabledEdit}
                                showIcon={false}
                    />
                </View>
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userDeptName} title='提交科室:'/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName} title='提交人:' /> : null
                }
                {
                    this.state.sourceType === '1'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'提交时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '2'?
                        <TextInputWidget editable={this.state.enabledEdit} title='交办领导:'/> : null
                }
                {
                    this.state.sourceType === '2'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '3'?
                        <TextInputWidget editable={this.state.enabledEdit} title='交办人:'/> : null
                }
                {
                    this.state.sourceType === '3'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.keywordStr} title='关键字:'/>
                <TextInputWidget editable={this.state.enabledEdit} title='提交审核人:' value={this.state.approvalReportUserName}/>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'提交审核时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.approvalReportTime}
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled={!this.state.enabledEdit}
                                showIcon={false}
                    />
                </View>
                {
                    this.state.buttons && this.state.buttons.map((i)=>{
                        return (
                            <TouchableOpacity style={styles.button} onPress={this.uploadNoticeInfo} >
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
        if (this.state.enabledEdit === false){
            return;
        }
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };
    uploadNoticeInfo=()=> {
        this.props.navigation.navigate('AuditOptions',{ids: [this.props.navigation.getParam('id')]})
    };
};
const styles = StyleSheet.create({
    button:{
        margin: 10*unitWidth,
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