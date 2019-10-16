import React from 'react';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import TextInputWidget from "../../Widget/TextInputWidget";
import TextInputMultWidget from "../../Widget/TextInputMultWidget";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

var dutyStr = '';
var finishStr = '';
export default class WorkPracticable extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '清单详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'更多'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        let alertArr = [];
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        alertArr.push({text:'系统记录', style:{color:'#38ADFF', fontWeight: 'bold'}});
        this.state.luoShiData.length > 0 ? alertArr.push({text:'落实情况', style:{color:'#38ADFF', fontWeight: 'bold'}}) : null
        alertArr.push({text:'取消', style:{color:'#38ADFF', fontWeight: 'bold'}});
        RRCAlert.alert('请选择', '', alertArr, (index)=>{
            switch (index) {
                case 0:
                    this.props.navigation.navigate('PracticableLog', {id: id});
                    break;
                case 1:
                    this.state.luoShiData.length > 0 ?
                        this.props.navigation.navigate('PracticableLuoShi', {id: id, LS: this.state.luoShiData}) : null;
                    break;
                case 2:
                    break;
            }
        });
    };
    constructor (){
        super ();
        this.state = {
            enableEdit: false,
            name: '',
            unit: '',
            duty: '',
            chargeWork: '',
            content: '',
            fileDTOList: [],
            createTime: '',
            dutyType: '',
            luoShiData: [],
        }
    }
    componentDidMount(): void {

        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        let id = navigation.getParam('id');

        HttpPost(URLS.GetDutyPracticableById, {id: id}, '正在查询').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                HttpPost(URLS.GetSubjectDutyById, {id:response.data.dutyInventoryId}, '正在查询...').then((response)=>{
                    RRCToast.show(response.msg);
                    if (response.result === 1){
                        let model = response['data'];
                        switch (model.dutyType) {//责任主体：1-领导班子，2-党组织书记，3-班子其他成员
                            case 1:
                                dutyStr = '领导班子';
                                break;
                            case 2:
                                dutyStr = '党组织书记';
                                break;
                            case 3:
                                dutyStr = '班子其他成员';
                                break;
                        }
                        switch (model.progress) {
                            case 1:
                                finishStr = '完成';
                                break;
                            case 2:
                                finishStr = '在办';
                                break;
                            case 3:
                                finishStr = '未办';
                                break;
                        }
                        this.setState({
                            name: model.name,
                            unit: model.unit,
                            duty: model.duty,
                            chargeWork: model.chargeWork,
                            content: model.content,
                            fileDTOList: model.fileDTOList,
                            createTime: model.createTime,
                            dutyType: model.dutyType,
                        });
                    }
                }).catch((err)=>{
                    RRCAlert.alert('服务器内部错误');
                });
                HttpPost(URLS.GetDutyByDutyInventoryId, {dutyInventoryId: response.data.dutyInventoryId}).then((response)=>{
                    if (response.result === 1){
                        this.setState({
                            luoShiData: response['data'],
                        })
                    }
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        });
    }
    render(): React.ReactNode {

        var fileButtons = [] ;

        for(let i in this.state.fileDTOList){
            let nameStr = this.state.fileDTOList[i].name ? this.state.fileDTOList[i].name : this.state.fileDTOList[i].fileName;
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(this.state.fileDTOList[i])
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>
                    <TextInputWidget editable={this.state.enabledEdit} value={dutyStr}  title='责任主体:'/>
                    <TextInputWidget editable={this.state.enabledEdit} value={finishStr}  title='完成情况:'/>
                    {
                        this.state.dutyType === 1 ? null :
                            <TextInputWidget editable={this.state.enabledEdit} value={this.state.name}  title='姓名:'/>
                    }
                    {
                        this.state.dutyType === 1 ? null :
                            <TextInputWidget editable={this.state.enabledEdit} value={this.state.unit}  title='单位:'/>
                    }
                    {
                        this.state.dutyType === 1 ? null :
                            <TextInputWidget editable={this.state.enabledEdit} value={this.state.duty}  title='职务:'/>
                    }
                    {
                        this.state.dutyType === 1 ? null :
                            <TextInputWidget editable={this.state.enabledEdit} value={this.state.chargeWork}  title='分管工作:'/>
                    }
                    <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.content} title='内容列表:'/>
                    {
                        this.state.fileDTOList ?  fileButtons  :  null
                    }
                    <TextInputWidget editable={this.state.enabledEdit} value={this.state.createTime}  title='添加时间:'/>
                    {
                        this.props.navigation.getParam('hasButton') === true ?
                            <TouchableOpacity style={styles.button} onPress={this._optionsAction} >
                                <Text style={styles.buttonText}>
                                    {'审核'}
                                </Text>
                            </TouchableOpacity>: null
                    }
                </View>
            </KeyboardAwareScrollView>
        )
    }
    _optionsAction = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let type = navigation.getParam('approveType');
        navigation.navigate('ApprovalWorkOptions', {id: id, approveType: type});
    };
    _pressDetail = (attachItem)=> {
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };
}
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

});
