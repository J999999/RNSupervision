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
var _that = this;

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
            console.log('99999999999 = ', response.data);
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
                let kkk;
                if (model.releaseType === 1){
                    releaseTypeStr = '发布';
                    kkk = '1';
                } else {
                    releaseTypeStr = '未发布';
                    kkk = '2';
                }
                let nameArr = [];
                if (model.visualRangeDeptList) {
                    let tempA = [];
                    tempA = tempA.concat(model.visualRangeDeptList);
                    tempA.map((i)=>{
                        nameArr.push(i.deptName);
                    });
                }
                this.setState({
                    id : id,
                    billCode: model.billCode,
                    filesList: model.filesList ? model.filesList : [],
                    reFilesList: model.reFilesList ? model.reFilesList : [],
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
                    interviewList: model.interviewList,
                    symbolCode: model.symbolCode,
                    releaseType: kkk,
                    visualRange: nameArr.join(','),
                    releaseTime: model.releaseTime,
                    visualRangeList: model.visualRangeList,
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
            symbolCode: '',            // 文号
            billCode: '',              // 编号  文本输入框，必填。
            filesList: [],             // 附件  非必填
            reFilesList: [],
            userName: '',              // 提交人     文本输入框，必填。
            keywordStr: '',            // 关键字     文本输入框，必填。
            sourceType: '',            // 事项来源    底部弹出框，必选。
            interviewName: '',         // 约谈对象    文本输入框，必填。
            matter: '',                // 约谈事项    文本输入框，必填。
            situation: '',             // 约谈内容    文本输入框，必填。
            processingResults: '',     // 办理结果    文本输入框，必填。
            userDeptName: '',          // 提交科室    文本输入框，必填。
            reportTimeStr: '',         // 提交时间    日期选择框，必填。
            finishTimeStr: '',         // 发文时间  日期选择框，非必填。（ 不填，提请发布审核框不可选 ）
            hasAttach:false,           // 附件相关，与上传数据无关
            reAttach: false,
            interviewList: [],
            releaseType: '',
            visualRange: '',
            visualRangeList: [],
            releaseTime: '',
        };
    }
    render(): React.ReactNode {
        var reFileButtons = [];
        var fileButtons = [] ;
        var ss = [];
        this.state.reFilesList.map((i, key) => {
            let nameStr = i.name ? i.name : i.fileName;
            var reButton = (
                <View
                    key={key}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this.rePressDelAttach(i);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this.rePressDetail(i)
                        }}   />
                    </View>
                </View>
            );
            reFileButtons.push(reButton);
        });

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
                <View style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center', borderBottomWidth: unitWidth , borderColor: '#F4F4F4'}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333', marginLeft: 15*unitWidth}}>
                        {j === 0 ? '约谈对象:' : ''}
                    </Text>
                    <View style={{width: 245*unitWidth}}>
                        <View style={{flexDirection: 'row'}}>
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
                        <View style={{flexDirection: 'row'}}>
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
                {
                    this.state.reFilesList.length > 0 ?  reFileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.reTakePicture.bind(this)}/>
                {ss}
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
                    this.state.filesList.length > 0 ?  fileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.symbolCode}  title='文号:'  placeholder='请输入文号' onChangeText={(text)=>{
                    this.setState({symbolCode: text});
                }}
                />
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'发文时间:'}</Text>
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
                <JQAlertBottomView leftName={'是否发布'}
                                   enabledEdit={this.state.enabledEdit}
                                   dataSource={
                                       [
                                           {'name':'发布', 'id':'1'},
                                           {'name':'不发布', 'id':'2'},
                                       ]
                                   }
                                   alertTitle={releaseTypeStr}
                                   callBack={(item) => {
                                       this.setState({releaseType: item.id});
                                   }}
                />
                {
                    this.state.releaseType === '1' ? (this.state.enableEdit === false ?
                        <TextInputWidget    title='可视范围:'  placeholder='请选择可视范围' editable={false} value={this.state.visualRange}/> :
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('GetDeptInfo',{callback: function (data) {
                                let nameArr = [];
                                let idsArr = [];
                                for (let i = 0; i < data.length; i++){
                                    nameArr.push(data[i].deptName);
                                    idsArr.push(data[i].id);
                                }
                                let nameStr = nameArr.join(',');
                                _that.setState({
                                    visualRange: nameStr,
                                    visualRangeList: idsArr,
                                })
                            }})}}>
                            <TextInputWidget    title='可视范围:'  placeholder='请选择可视范围' editable={false} value={this.state.visualRange}/>
                        </TouchableOpacity>) : null
                }
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'发布时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.releaseTime}
                                mode="date"
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                disabled={!this.state.enabledEdit}
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({releaseTime: dateTime})}}
                                placeholder={this.state.releaseTime}
                    />
                </View>
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
    reTakePicture = async function() {

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
                for(let i in this.state.reFilesList){
                    if(this.state.reFilesList[i].uri === response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                let tempArr = [];
                tempArr = tempArr.concat(this.state.reFilesList);
                let index = response.uri.indexOf('/images/') + 8;
                response['fileName'] = response.uri.substr(index, response.uri.length - index);
                tempArr.push(response);

                this.setState({
                    reFilesList: tempArr,
                    reAttach:true,
                });
            }
        });
    };
    rePressDelAttach = (item)=>{
        if (this.state.enabledEdit === false){
            return;
        }
        let has = false;
        for(let i in this.state.reFilesList){
            if(this.state.reFilesList[i] === item){
                this.state.reFilesList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.state.reFilesList.length>0){
                this.setState({
                    reAttach:true
                });
            }else{
                this.setState({
                    reAttach:false,
                });
            }
        }
    };
    rePressDetail = (attachItem)=> {
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
