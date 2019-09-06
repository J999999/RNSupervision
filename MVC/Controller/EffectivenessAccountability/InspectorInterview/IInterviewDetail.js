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

export default class IInterviewDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '约谈详情',
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
            console.log('约谈详情 = ', response);
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
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.billCode}  title='编号:'  placeholder='请输入编号' onChangeText={(text)=>{
                    this.setState({billCode: text});
                }}
                />
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.interviewName}  title='约谈对象:'  placeholder='请输入约谈对象' onChangeText={(text)=>{
                    this.setState({interviewName: text});
                }}
                />
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.matter} title='约谈事项:'  placeholder='请输入约谈事项' onChangeText={(text)=>{
                    this.setState({matter: text});
                }}/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.situation} title='约谈内容:'  placeholder='请输入约谈内容' onChangeText={(text)=>{
                    this.setState({situation: text});
                }}/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.processingResults} title='办理结果:'  placeholder='请输入办理结果' onChangeText={(text)=>{
                    this.setState({processingResults: text});
                }}/>
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'约谈完成时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.finishTimeStr}
                                mode="date"
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                disabled={!this.state.enabledEdit}
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({finishTimeStr: dateTime})}}
                                placeholder={this.state.finishTimeStr}
                    />
                </View>
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userDeptName} title='提交科室:' placeholder='请输入提交科室' onChangeText={(text)=>{this.setState({userDeptName: text});}}/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName} title='提交人:' placeholder='请输入提交人' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'提交时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={this.state.reportTimeStr}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '2'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName} title='交办领导:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '2'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={this.state.reportTimeStr}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '3'?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName} title='交办人:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '3'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={this.state.reportTimeStr}
                            />
                        </View> : null
                }
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.keywordStr} title='关键字:'  placeholder='请输入关键字' onChangeText={(text)=>{
                    this.setState({keywordStr: text});
                }}/>
                {
                    this.state.buttons && this.state.buttons.map((i)=>{
                        return (
                            <TouchableOpacity style={styles.button} onPress={()=>this._pressSumbit(i.name)} >
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
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };

    _pressSumbit = (type) => {
        if(this.state.sourceType === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.billCode === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.interviewName === ''){
            RRCToast.show('请输入约谈对象');
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
        var files = [];

        if(this.state.filesList &&  this.state.filesList.length>0){
            var formData = new FormData();
            for(let i  in this.state.filesList){
                let nameStr = this.state.filesList[i].name ? this.state.filesList[i].name : this.state.filesList[i].fileName;
                let urlStr = this.state.filesList[i].url ? this.state.filesList[i].url : this.state.filesList[i].uri;
                let file = {uri:urlStr,type:'multipart/form-data',name:nameStr};
                formData.append('files',file);
            }
            HttpPostFile(URLS.FileUploads,formData,"正在上传文件...").then((response)=>{
                if(response.result === 1){
                    files = response.data;
                    this.uploadNoticeInfo(files, type)
                }
            }).catch((error)=>{
                RRCToast.show(error);
            });
        }else{
            this.uploadNoticeInfo([], type)
        }
    };

    uploadNoticeInfo=(files, type)=> {
        if (type === 'EDIT'){
            let requestData = {};
            requestData = this.state;
            requestData['filesList'] = files;
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
