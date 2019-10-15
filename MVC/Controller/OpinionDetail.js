import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    Image, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';
import {RRCToast} from 'react-native-overlayer/src';
import DataDictionary from '../Tools/DataDictionary';
import {unitWidth} from '../Tools/ScreenAdaptation';
import { RRCActionSheet } from 'react-native-overlayer'
import {downOpenFile} from '../Tools/Utils';

var screenWidth = Dimensions.get('window').width;
var context ;

class OpinionDetail extends Component {

    constructor(props){
        super(props);
        context = this;
        this.bean = null;
        this.approvals = [];
        this.sysLogs = [];
        this.isApprovalResult = false;
        this.isLogResult = false;
        this.infoCode = '1';

        this.buttons = null;

        this.state = {
            switchTab:false,
            show:false,

        }
    };

    componentDidMount(): void {
        this.getProjectInfo()
    }

    renderTabItem(code, label) {
        return <TouchableOpacity style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                                 onPress={() => {
                                     this.infoCode = code
                                     this.setState({
                                         switchTab:true
                                     })
                                 }}
        >
            <Text
                style={{
                    color: this.infoCode === code ? '#38ADFF' : "#999999",
                    fontSize: 17*unitWidth,
                    paddingVertical:  15*unitWidth ,
                }}>{label}</Text>
        </TouchableOpacity>;
    }

    renderViewContent=()=>{
        return this.renderItemData(this.infoCode)
    }

    renderItemData=(code)=>{
        switch (code) {
            case  '1':
                return  this.renderNormalData()
                break;
            case  '2':
                if(this.bean&& this.bean.dutyUnitList && this.bean.dutyUnitList.length>0){
                    return this.renderResponseDepartmentData()
                }else {
                    return this.renderBlank()
                }
                break;
            case  '3':
                if(this.isApprovalResult){
                    if(this.approvals && this.approvals.length>0 ){
                        return this.renderApprovalData()
                    }else{
                        return this.renderBlank()
                    }
                }else{
                    this.getProjectApproval();
                }
                break;
            case  '4':
                if(this.isLogResult){
                    if(this.sysLogs && this.sysLogs.length>0 ){
                        return this.renderSysLogData()
                    }else{
                        return this.renderBlank()
                    }
                }else{
                    this.getSysLogInfo();
                }
                break;
            default:
                break;
        }
    }

    renderNormalData=()=>{
       var yearViews =[]
       var fileViews = []
       if(this.bean.yearlyPlanList!=null) {
           for(let i  in this.bean.yearlyPlanList){
               let year = this.bean.yearlyPlanList[i];
               let view = (
                   <View style={styles.view}>
                       <Text style={styles.titleInfo}>{year.sort}</Text>
                       <Text style={styles.titleInfo}>{year.year}</Text>
                       <Text style={styles.titleInfo}>{year.invest}{DataDictionary.MoneyUnit[year.moneyUnit]}</Text>
                   </View>
               );
               yearViews.push(view)
           }
       }

       if(this.bean.fileDTOList){
            for(let i  in this.bean.fileDTOList){
                let file = this.bean.fileDTOList[i];
                let view = (
                    <TouchableOpacity style={styles.view} onPress={()=>{
                        downOpenFile(file)
                    }}>
                        <Text style={styles.titleInfo}>附件：{file.name}</Text>
                    </TouchableOpacity>
                );
                fileViews.push(view)
            }
       }


       let mainView = []
        //事项分类：1-重点项目，2-领导批示，3-决策部署，4-政务督查，5-民生实事，6-两代表一委员建议（议案）、提案，7-其他工作
        switch (this.bean.projectType) {
            case 1:
                mainView = <ScrollView style={styles.main}>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>项目名称：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>项目内容：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>所属类别：{DataDictionary.BelongTypes[this.bean.belongType]}</Text>
                        <Text style={styles.titleInfo}>新开工/续建：{this.bean.projectState&&this.bean.projectState==1 ? '新开工': '续建'}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>进展情况：{DataDictionary.ProgressTypes[this.bean.progress]}</Text>
                        <Text style={styles.titleInfo}>督查状态：{DataDictionary.SuperViseStates[this.bean.superviseState]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>总投资：{this.bean.totalCost}</Text>
                        <Text style={styles.titleInfo}>起止年限：{this.bean.years}</Text>
                    </View>
                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}
                    {
                        this.bean.yearlyPlanList!=null && <View style={styles.view}>
                            <Text style={styles.titleInfo}>序号 </Text>
                            <Text style={styles.titleInfo}>年度 </Text>
                            <Text style={styles.titleInfo}>投资额 </Text>
                        </View>
                    }
                    {yearViews}
                </ScrollView>
                break;

            case 2:

                mainView = <ScrollView style={styles.main}>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>批示事项：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>批示内容：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>批示领导：{this.bean.assignLead}</Text>
                        <Text style={styles.titleInfo}>批示日期：{this.bean.assignTime}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>所属类别：{DataDictionary.BelongTypes[this.bean.belongType]}</Text>
                        <Text style={styles.titleInfo}>完成时限：{this.bean.finishTime}</Text>
                    </View>
                    {/*<View style={styles.view}>*/}
                    {/*    <Text style={styles.titleInfo}>进展情况：{DataDictionary.ProgressTypes[this.bean.progress]}</Text>*/}
                    {/*    <Text style={styles.titleInfo}>督查状态：{DataDictionary.SuperViseStates[this.bean.superviseState]}</Text>*/}
                    {/*</View>*/}

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>
                break;


            case 3:
                mainView = <ScrollView style={styles.main}>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>工作名称：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>工作内容：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>交办领导：{this.bean.assignLead}</Text>
                        <Text style={styles.titleInfo}>交办单位：{this.bean.assignUnit}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>交办时间：{this.bean.assignTime}</Text>
                        <Text style={styles.titleInfo}>完成时限：{this.bean.finishTime}</Text>
                    </View>

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>

                break;

            case 4 :
                mainView = <ScrollView style={styles.main}>

                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>重点工作：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>年度目标：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>交办时间：{this.bean.assignTime}</Text>
                    </View>

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>
                break;

                //事项分类：1-重点项目，2-领导批示，3-决策部署，4-政务督查，5-民生实事，6-两代表一委员建议（议案）、提案，7-其他工作
            case 5:
                mainView = <ScrollView style={styles.main}>

                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项名称：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>承担实事具体任务：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>所属类别：{DataDictionary.BelongTypes[this.bean.belongType]}</Text>
                        <Text style={styles.titleInfo}>交办时间：{this.bean.assignTime}</Text>
                    </View>

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>
                break;

            case 6:
                mainView = <ScrollView style={styles.main}>

                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>编号：{ this.bean.projectCode}</Text>
                        <Text style={styles.titleInfo}>代表(委员)：{ this.bean.deputy }</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>标题：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>内容：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>所属类别：{DataDictionary.BelongTypes[this.bean.belongType]}</Text>
                        <Text style={styles.titleInfo}>完成时限：{this.bean.finishTime}</Text>
                    </View>

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>
                break;

            case 7:

                mainView = <ScrollView style={styles.main}>

                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>事项分类：{DataDictionary.MatterTypes[this.bean.projectType]}</Text>
                        <Text style={styles.titleInfo}>工作属性：{DataDictionary.WorkTypes[this.bean.workAttr]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>标题：{this.bean.projectName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>内容：{this.bean.projectInfo}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>交办时间：{this.bean.assignTime}</Text>
                        <Text style={styles.titleInfo}>完成时限：{this.bean.finishTime}</Text>
                    </View>

                    <View style={{borderBottomWidth: unitWidth , borderColor: '#F4F4F4', height:3*unitWidth}}/>
                    {fileViews}

                </ScrollView>

                break;

        }


        return mainView
    }

    renderResponseDepartmentData=()=>{

        let view = []
        let contentview = []

        for(let i in this.bean.dutyUnitList){
            let unit = this.bean.dutyUnitList[i]

            let timeviews = []
            if(unit.reportMode === 1){
                timeviews.push(<View style={styles.view}>
                    <Text style={styles.titleInfo}>首次汇报时间:{unit.reportTimeList[0].reportTime} 每{unit.reportTimeList[0].timeNumber}{DataDictionary.TimeUnitTypes[unit.reportTimeList[0].timeUnit]}汇报一次</Text>
                </View>)
            }else{
                timeviews.push(<View style={styles.view}>
                    <Text style={styles.titleInfo}>汇报节点</Text><Text style={styles.titleInfo}>备注</Text>
                </View>)
                for (let j in unit.reportTimeList){
                    timeviews.push(<View style={styles.view}>
                        <Text style={styles.titleInfo}>{unit.reportTimeList[j].reportTime}</Text><Text style={styles.titleInfo}>{unit.reportTimeList[j].memo}</Text>
                    </View>)
                }
            }

            contentview.push(
                <View >
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>{unit.unitType===1?'牵头':'责任'}单位：{unit.unitName}</Text>
                        <Text style={styles.titleInfo}>进展情况：{DataDictionary.ProgressTypes[unit.progress]}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>督办状态：{DataDictionary.SuperViseStates[unit.superviseState]} </Text>
                        <Text style={styles.titleInfo}>汇报时间设定：{unit.reportTimeSet === 1 ? '单独设置':'与牵头单位一致'} </Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>汇报模式：{unit.reportMode === 1 ? '周期汇报':'固定时间点汇报'} </Text>
                    </View>

                    {timeviews}

                    <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>
                </View>)
        }

        view.push(<ScrollView style={styles.main}>
            {contentview}
        </ScrollView>)
        return view;
    }

    renderApprovalData=()=>{

        let view = []
        let contentview = []

        for(let i in this.approvals){
            let bean = this.approvals[i]
            contentview.push(<View >
                <View style={styles.view}>
                    <Text style={styles.titleInfo}>{bean.userName}    {bean.approvalStateStr}</Text>
                    <Text style={styles.titleInfo}>{bean.createTime}</Text>
                </View>

                <View style={styles.view}>
                    <Text style={styles.titleInfo}>审批意见：{bean.approvalOpinion}</Text>
                </View>
                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>
            </View>)
        }

        view.push(<ScrollView style={styles.main}>
            {contentview}
        </ScrollView>)


        return view;

    }

    renderSysLogData=()=>{

        let view = []
        let contentview = []

        for(let i in this.sysLogs){
            let bean = this.sysLogs[i]
            contentview.push(<View >
                <View style={styles.view}>
                    <Text style={styles.titleInfo}>{bean.deptName}   {bean.creatorName}   {bean.operateType}</Text>
                    <Text style={styles.titleInfo}>{bean.createTime}</Text>
                </View>

                <View style={styles.view}>
                    <Text style={styles.titleInfo}>操作内容：{bean.depictInfo}</Text>
                </View>

                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

            </View>)
        }
        view.push(<ScrollView style={styles.main}>
            {contentview}
        </ScrollView>)
        return view;

    }

    renderBlank = () => <View style={[this.props.style, {flex: 1, alignItems: 'center', backgroundColor: '#fff'}]}>

        <Text style={{fontSize: 13*unitWidth, color: '#999999', marginTop: 15*unitWidth}}> 暂无内容 </Text>

    </View>;

    getSysLogInfo() {
        HttpPost(URLS.SysLog,{id:this.bean.id},"正在查询").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.sysLogs = response.data
                this.isLogResult = true
                this.setState({
                    switchTab:true
                })
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    getProjectApproval(){
        HttpPost(URLS.QueryApproval,{id:this.bean.id},"正在查询").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.approvals = response.data
                this.isApprovalResult = true
                this.setState({
                    switchTab:true
                })
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    getProjectInfo(){
        HttpPost(URLS.ProjectDetail,{id:this.bean.id},"").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.bean = response.data
                // this.fileList = response.data.fileDTOList
                this.setState({
                    show:true
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }
    static  navigationOptions = ({navigation}) =>({
        title: '详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('ReportOpinionSummary',{
                                                bean:context.bean,
                                                callback:function(){
                                                    context.getProjectInfo()
                                                }
                                            });
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>批示汇报</Text>
        </TouchableOpacity>)
    });

    buttonAction(){

        RRCActionSheet.setActionSheetOptions({
            fontSize: 17*unitWidth, // 文字字号
            itemHeight: 56*unitWidth, // 单个item的高度
            buttonTitleColor: 'rgba(0, 0, 14, 0.8)', // 备选按钮字体颜色
            cancelButtonTitleColor: 'rgba(0, 0, 0, 0)', // 取消按钮字体颜色
            buttonItemBackgroundColor: '#eee', // 备选按钮背景颜色
            cancelButtonBackgroundColor: '#38ADFF', // 取消按钮背景颜色
        })

        let buttons =[]
        for(let i in this.buttons){
            let button = this.buttons[i]
            buttons.push({
                text:button.title,style:{color: '#38ADFF', fontSize: 17*unitWidth}
            })
        }

        let callback = (index)=>{
            // console.log(`you click button with index ${index}`+ JSON.stringify(this.buttons[index]));
            if(index<0){
                RRCActionSheet.hide();
                return;
            }
            let btn  = this.buttons[index]
            switch(btn.name){
                case 'DELAY'://延期
                    this.props.navigation.navigate('ApplyDelayAdd', {title:'延期',url:URLS.ProjectDelaySave,id:this.bean.id,finishTime:this.bean.finishTime,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'INTERVIEW'://约谈
                    this.props.navigation.navigate('ApplyInterviewAdd', {title:'约谈',url:URLS.ProjectInterviewSave,id:this.bean.id,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'ACCOUNTABILITY'://问责
                    this.props.navigation.navigate('ApplyDutyAdd', {title:'问责',url:URLS.ProjectDutySave,id:this.bean.id,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'APPLY_DELAY'://申请延期
                    this.props.navigation.navigate('ApplyDelayAdd', {title:'申请延期',url:URLS.ProjectApplicationSave,id:this.bean.id,finishTime:this.bean.finishTime,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'APPLY_INTERVIEW'://提请约谈
                    this.props.navigation.navigate('ApplyInterviewAdd', {title:'提请约谈',url:URLS.ProjectApplicationSave,id:this.bean.id,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'APPLY_ACCOUNTABILITY'://提请问责
                    this.props.navigation.navigate('ApplyDutyAdd', {title:'提请问责',url:URLS.ProjectApplicationSave,id:this.bean.id,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'OPINIONS':// 意见建议
                    this.props.navigation.navigate('OpinionAdd', {id:this.bean.id,callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'INSTRUCTIONS':// 批示

                    break;
                case 'AGREE'://同意
                    this._pressAgreeButton()
                    break;
                case 'REJECT'://驳回
                    this.props.navigation.navigate('OpinionWithContent', {ids: [this.bean.id],callback:function(){
                            context.getProjectInfo()
                        }});
                    break;
                case 'UNFOLLOW'://取消关注
                    this._pressUnFollowButton()
                    break;
                case 'FOLLOW'://关注
                    this._pressFollowButton()
                    break;
                default:
                    RRCToast.show('未开发')
                    break;
            }
        }

        let cancelButton = {text: '取消', name:'CANCEL',style:{fontSize:17*unitWidth,color: '#ffffff'}} // 默认【取消】 样式可以通过option统一设置

        RRCActionSheet.action( buttons, callback ,cancelButton);
    }

    _pressAgreeButton =()=>{
        HttpPost(URLS.ProjectApprovalAgree,{projectIdList:[this.bean.id]},"正在请求").then((response)=>{
            if(response.result == 1){
                RRCToast.show(response.msg)
                this.getProjectInfo()
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });

    }

    _pressFollowButton =()=>{
        HttpPost(URLS.AddProjectRelation,{id:this.bean.id},"正在关注").then((response)=>{
            RRCToast.show(response.msg)
            if(response.result == 1){
                const {navigation} = this.props;
                navigation.state.params.callback()
                navigation.goBack();
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });

    }

    _pressUnFollowButton =()=>{
        HttpPost(URLS.DeleteProjectRelation,{id:this.bean.id},"正在取消").then((response)=>{
            RRCToast.show(response.msg)
            if(response.result == 1){
                const {navigation} = this.props;
                navigation.state.params.callback()
                navigation.goBack();
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    render(){
        const  {params} = this.props.navigation.state;

        if(params && this.bean==null){
            this.bean = params.bean
            this.buttons = params.bean.buttons
        }

        console.log(this.bean)

        return (
            <View style = {styles.all}>
                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

                <View style={{flexDirection: 'row'}}>
                    {this.renderTabItem("1", '基本信息')}
                    {this.renderTabItem("2", '责任单位')}
                    {this.renderTabItem("3", '审批流程')}
                    {this.renderTabItem("4", '系统记录')}
                </View>

                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

                {
                    this.renderViewContent()
                }


                {this.buttons!=null && <View style={{position: 'absolute', right: 15*unitWidth, bottom: 50*unitWidth}}>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>{this.buttonAction()}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange',
                            padding: 5*unitWidth, height: 54*unitWidth, width: 54*unitWidth,
                            borderRadius: 108*unitWidth}}>
                            <Image source={require('../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>}
            </View>

        );
    }
}


var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#fff',
    },

    scroll:{
        backgroundColor:'#fff',
        paddingTop:15*unitWidth,
    },

    main:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        // alignItems: "center",
        // justifyContent: "center"
    },

    title:{
        color:'#000000',
        fontSize:20*unitWidth,
        marginBottom:8*unitWidth,
        marginLeft:8*unitWidth,
        marginRight:8*unitWidth,
    },

    titleInfo:{
        alignSelf:'flex-start',
        color:'#666',
        fontSize:14*unitWidth,
    },

    content:{
        alignSelf:'flex-start',
        marginLeft:8*unitWidth,
        marginRight:8*unitWidth,
        marginTop:10*unitWidth,
        fontSize:16*unitWidth,
    },

    font:{
        fontSize:14*unitWidth,
        color:'orange',
    },

    line:{
        height:0.5*unitWidth,
        margin:5*unitWidth,
        width:600*unitWidth,
        backgroundColor:'gray',
    },

    view:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#ffffff',
        padding:8*unitWidth,
    },
})

module.exports = OpinionDetail
