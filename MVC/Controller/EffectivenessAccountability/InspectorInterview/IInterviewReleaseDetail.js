import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Button} from 'react-native';
import {screenWidth, unitWidth} from "../../../Tools/ScreenAdaptation";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import DataPicker from 'react-native-datepicker'
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";

var sourceTypeStr = '';

export default class IInterviewReleaseDetail extends React.Component {
    static navigationOptions = ({navigation}) => ({
        title: '约谈事项详情',
    });

    componentDidMount(): void {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.QueryInfoById, {id: id}, '正在查询...').then((response) => {
            console.log('约谈事项详情 = ', response);
            RRCToast.show(response.msg);
            if (response.result === 1) {
                let model = response['data'];
                if (model.sourceType === 1) {
                    sourceTypeStr = '内部转办'
                } else if (model.sourceType === 2) {
                    sourceTypeStr = '领导交办'
                } else if (model.sourceType === 3) {
                    sourceTypeStr = '临时交办'
                }
                this.setState({
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
        }).catch((err) => {
            RRCAlert.alert('服务器内部错误');
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            enabledEdit: false,        // 页面中组件是否可编辑
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
            hasAttach: false,           // 附件相关，与上传数据无关
        };
    }

    render(): React.ReactNode {

        var fileButtons = [];

        for (let i in this.state.filesList) {
            let nameStr = this.state.filesList[i].name ? this.state.filesList[i].name : this.state.filesList[i].fileName;
            var button = (
                <View
                    key={i}
                    style={styles.attach}>
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：' + nameStr} </Text>
                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={() => {
                            this._pressDetail(this.state.filesList[i])
                        }}/>
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TextInputWidget editable={this.state.enabledEdit} value={sourceTypeStr} title='事项来源:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.billCode} title='编号:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.interviewName} title='约谈对象:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.matter} title='约谈事项:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.situation} title='约谈内容:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.processingResults}
                                     title='办理结果:'/>
                {
                    this.state.hasAttach === true ? fileButtons : null
                }
                <View style={{
                    flexDirection: 'row', alignItems: 'center', padding: 15 * unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor: '#F4F4F4', height: 54 * unitWidth
                }}>
                    <Text style={{fontSize: 15 * unitWidth}}>{'约谈完成时间:'}</Text>
                    <DataPicker style={{width: 200 * unitWidth, marginLeft: 5 * unitWidth}}
                                date={this.state.finishTimeStr}
                                format="YYYY-MM-DD HH:mm:ss"
                                disabled={!this.state.enabledEdit}
                                showIcon={false}
                    />
                </View>
                {
                    this.state.sourceType === '1' ?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userDeptName}
                                         title='提交科室:'/> : null
                }
                {
                    this.state.sourceType === '1' ?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName}
                                         title='提交人:'/> : null
                }
                {
                    this.state.sourceType === '1' ?
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', padding: 15 * unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor: '#F4F4F4', height: 54 * unitWidth
                        }}>
                            <Text style={{fontSize: 15 * unitWidth}}>{'提交时间:'}</Text>
                            <DataPicker style={{width: 200 * unitWidth, marginLeft: 5 * unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '2' ?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName}
                                         title='交办领导:'/> : null
                }
                {
                    this.state.sourceType === '2' ?
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', padding: 15 * unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor: '#F4F4F4', height: 54 * unitWidth
                        }}>
                            <Text style={{fontSize: 15 * unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200 * unitWidth, marginLeft: 5 * unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '3' ?
                        <TextInputWidget editable={this.state.enabledEdit} value={this.state.userName}
                                         title='交办人:'/> : null
                }
                {
                    this.state.sourceType === '3' ?
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', padding: 15 * unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor: '#F4F4F4', height: 54 * unitWidth
                        }}>
                            <Text style={{fontSize: 15 * unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200 * unitWidth, marginLeft: 5 * unitWidth}}
                                        date={this.state.reportTimeStr}
                                        format="YYYY-MM-DD HH:mm:ss"
                                        disabled={!this.state.enabledEdit}
                                        showIcon={false}
                            />
                        </View> : null
                }
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.keywordStr} title='关键字:'/>
            </KeyboardAwareScrollView>
        )
    }

    _pressDetail = (attachItem) => {
        this.props.navigation.navigate('AttachDetail', {item: attachItem});
    };
}
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
