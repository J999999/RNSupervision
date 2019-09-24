import React from 'react';
import {Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import TextInputWidget from "../../Widget/TextInputWidget";
import TextInputMultWidget from "../../Widget/TextInputMultWidget";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

var sourceTypeStr = '';
export default class InspectionreformDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '整改详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'系统记录'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        this.props.navigation.navigate('InspectionreformLog', {id: id});
    };
    constructor (){
        super ();
        this.state = {
            enableEdit: false,
            responsibleLeader: '', //责任领导
            responsibleDepartment: '', //责任部门
            responsiblePerson: '', //责任人
            timeLimit: '', //整改时限
            dealState: '', //办理情况
            problemList: '', //问题清单
            reformMeasures: '', //整改措施
            completion: '', //整改完成情况
            fileList: [], //附件
            createTimeStr: '', //添加时间
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.QueryDetailByInspectionreform, {id:id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                let model = response['data'];
                if (model.dealState === 0){
                    sourceTypeStr = '未办结'
                } else if (model.dealState === 1){
                    sourceTypeStr = '正在办理'
                } else if (model.dealState === 2){
                    sourceTypeStr = '已办结'
                }
                this.setState({
                    responsibleLeader: model.responsibleLeader,
                    responsibleDepartment: model.responsibleDepartment,
                    responsiblePerson: model.responsiblePerson,
                    timeLimit: model.timeLimit,
                    problemList: model.problemList,
                    reformMeasures: model.reformMeasures,
                    completion: model.completion,
                    fileList: model.fileList,
                    createTimeStr: model.createTimeStr,
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    render(): React.ReactNode {

        var fileButtons = [] ;

        for(let i in this.state.fileList){
            let nameStr = this.state.fileList[i].name ? this.state.fileList[i].name : this.state.fileList[i].fileName;
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(this.state.fileList[i])
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        return (
            <KeyboardAwareScrollView>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.responsibleLeader}  title='责任领导:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.responsibleDepartment}  title='责任部门:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.responsiblePerson}  title='责任人:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.timeLimit}  title='整改时限:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={sourceTypeStr}  title='办理情况:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.problemList} title='问题清单:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.reformMeasures} title='整改措施:'/>
                <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.completion} title='完成情况:'/>
                <TextInputWidget editable={this.state.enabledEdit} value={this.state.createTimeStr}  title='添加时间:'/>
                {
                    this.state.fileList ?  fileButtons  :  null
                }
                {
                    this.props.navigation.getParam('hasButton') === true ?
                        <TouchableOpacity style={styles.button} onPress={this._optionsAction} >
                            <Text style={styles.buttonText}>
                                {'审核'}
                            </Text>
                        </TouchableOpacity>: null
                }
            </KeyboardAwareScrollView>
        )
    }
    _optionsAction = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let type = navigation.getParam('approveType');
        navigation.navigate('ApprovalWorkOptions', {id: id, approveType: type});
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
