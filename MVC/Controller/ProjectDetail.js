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

var screenWidth = Dimensions.get('window').width;
var context ;

class ProjectDetail extends Component {

    constructor(props){
        super(props);
        context = this;
        this.bean = null;
        this.approvals = [];
        this.sysLogs = [];
        this.isApprovalResult = false;
        this.isLogResult = false;
        this.infoCode = '1';
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
        return <ScrollView style={styles.main}>
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
            <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

            {
                this.bean.yearlyPlanList!=null && <View style={styles.view}>
                    <Text style={styles.titleInfo}>序号 </Text>
                    <Text style={styles.titleInfo}>年度 </Text>
                    <Text style={styles.titleInfo}>投资额 </Text>
                </View>
            }
            {yearViews}
        </ScrollView>
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

            contentview.push(<View  style={styles.main}>
                <View style={styles.view}>
                    <Text style={styles.titleInfo}>{unit.unitType===1?'牵头':'配合'}单位：{unit.unitName}</Text>
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
                                            navigation.navigate('ProjectAdd',{
                                                bean:context.bean,

                                                callback:function(){
                                                    context.getProjectInfo()
                                                }
                                            });
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>修改</Text>
        </TouchableOpacity>)
    });

    render(){
        const  {params} = this.props.navigation.state;

        if(params && this.bean==null) this.bean = params.bean

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

module.exports = ProjectDetail
