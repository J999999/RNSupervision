/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import URLS from './MVC/Tools/InterfaceApi'
import React from 'react';
import {View} from 'react-native';
import NavigationService from './MVC/Tools/NavigationService'
import {createAppContainer, createStackNavigator} from 'react-navigation';

import Login from './MVC/Controller/Login'
import Home from './MVC/Controller/Home'
import {unitWidth} from "./MVC/Tools/ScreenAdaptation";
import Mine from './MVC/Controller/Mine'
import AddFunction from './MVC/Controller/AddFunction'
import AddIInterview from './MVC/Controller/EffectivenessAccountability/InspectorInterview/AddIInterview'//新增督查约谈
import IInterviewList from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewList'//督查约谈列表
import IInterviewDetail from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewDetail'//督查约谈详情
import ApprovalProcess from './MVC/Controller/EffectivenessAccountability/InspectorInterview/ApprovalProcess' //约谈审批流程
import SystemRecording from './MVC/Controller/EffectivenessAccountability/InspectorInterview/SystemRecording' //约谈系统记录
import BatchForms from './MVC/Controller/EffectivenessAccountability/InspectorInterview/BatchForms' //约谈呈批表
import AccountabilityList from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityList'//效能问责列表
import AccountabilityAdd from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityAdd' //新增效能问责
import RecallOption from './MVC/Controller/EffectivenessAccountability/EA/RecallOption' //撤回操作
import GetDeptInfo from './MVC/Controller/EffectivenessAccountability/InspectorInterview/GetDeptInfo' //可视范围
import AccountabilityDetail from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityDetail' //效能问责详情
import AuditList from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditList' //效能问责审核列表
import AuditDetail from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditDetail' //效能问责审核详情
import AuditOptions from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditOptions' //审核操作
import IInterviewReleaseList from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewReleaseList' //约谈事项查询
import IInterviewReleaseDetail from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewReleaseDetail' //约谈事项详情
import AccountabilityReleaseList from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityReleaseList' //问责事项查询
import AccountabilityReleaseDetail from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityReleaseDetail' //问责事项详情
import PAppraisalList from './MVC/Controller/PerformanceAppraisal/PAppraisalList' //绩效考核列表
import PAppraisalDetail from './MVC/Controller/PerformanceAppraisal/PAppraisalDetail' //绩效考核详情
import PAppraisalViewLog from './MVC/Controller/PerformanceAppraisal/PAppraisalViewLog' //绩效考核系统记录
import SubjectDutyNoticeList from './MVC/Controller/SubjectDutyNotice/SubjectDutyNoticeList'//清单通知
import SubjectDutyNoticeDetail from './MVC/Controller/SubjectDutyNotice/SubjectDutyNoticeDetail'
import SubjectDutyNoticeRead from './MVC/Controller/SubjectDutyNotice/SubjectDutyNoticeRead'
import PAppraisalApproval from './MVC/Controller/PerformanceAppraisal/PAppraisalApproval'
import FillAuditList from './MVC/Controller/PerformanceAppraisal/FillAuditList'
import FillInAuditDetail from './MVC/Controller/PerformanceAppraisal/FillInAuditDetail'
import FillInAuditOptions from './MVC/Controller/PerformanceAppraisal/FillInAuditOptions'
import IndicatorList from './MVC/Controller/PerformanceAppraisal/IndicatorList' //考核指标列表
import PreviewList from './MVC/Controller/PreviewAndRelease/PreviewList'//成绩预览列表
import PreviewDetail from './MVC/Controller/PreviewAndRelease/PreviewDetail'//成绩详情
import PreviewLog from './MVC/Controller/PreviewAndRelease/PreviewLog' //预览系统记录
import PreviewSetup from './MVC/Controller/PreviewAndRelease/PreviewSetup' //分值权重设置
import PreviewSetupDetail from './MVC/Controller/PreviewAndRelease/PreviewSetupDetail' //基本信息设置
import PreviewDeptSetup from './MVC/Controller/PreviewAndRelease/PreviewDeptSetup' //评分
import ShowScoreList from './MVC/Controller/ShowScore/ShowScoreList' //成绩展示列表
import ShowScoreDetail from './MVC/Controller/ShowScore/ShowScoreDetail' //成绩展示详情

import InspectionreformInformation from './MVC/Controller/SubjectResponsibility/InspectionreformInformation' //巡查整改党组信息
import InspectionreformList from './MVC/Controller/SubjectResponsibility/InspectionreformList' //巡查整改列表
import InspectionreformDetail from './MVC/Controller/SubjectResponsibility/InspectionreformDetail' //巡查整改详情
import InspectionreformLog from './MVC/Controller/SubjectResponsibility/InspectionreformLog' //巡查整改系统记录
import ExchangeexperienceList from './MVC/Controller/SubjectResponsibility/ExchangeexperienceList' //经验交流列表
import ExchangeexperienceDetail from './MVC/Controller/SubjectResponsibility/ExchangeexperienceDetail' //经验交流详情
import ExchangeexperienceLog from './MVC/Controller/SubjectResponsibility/ExchangeexperienceLog' //经验交流系统记录
import InformationImprovement from './MVC/Controller/SubjectResponsibility/InformationImprovement' //党组织信息完善
import DetailedListInformation from './MVC/Controller/SubjectResponsibility/DetailedListInformation' //主体责任清单党组信息
import DetailedList from './MVC/Controller/SubjectResponsibility/DetailedList' //主体责任清单列表
import DetailedListDetail from './MVC/Controller/SubjectResponsibility/DetailedListDetail' //主体责任清单详情
import DetailedListLog from './MVC/Controller/SubjectResponsibility/DetailedListLog' //主体责任清单系统记录
import DetailedListLuoShi from './MVC/Controller/SubjectResponsibility/DetailedListLuoShi' //主体责任清单落实情况
import PracticableInformation from './MVC/Controller/SubjectResponsibility/PracticableInformation'
import PracticableList from './MVC/Controller/SubjectResponsibility/PracticableList'
import PracticableDetail from './MVC/Controller/SubjectResponsibility/PracticableDetail'
import PracticableLuoShi from './MVC/Controller/SubjectResponsibility/PracticableLuoShi'
import ApprovalWorkList from './MVC/Controller/SubjectResponsibility/ApprovalWorkList' //工作审核
import ApprovalWorkOptions from './MVC/Controller/SubjectResponsibility/ApprovalWorkOptions' //工作审核操作页面
import KDataCloudList from './MVC/Controller/DataCloudDisk/KDataCloudList'
import JDataCloudList from './MVC/Controller/DataCloudDisk/JDataCloudList'
import WorkPracticable from './MVC/Controller/SubjectResponsibility/WorkPracticable'
import PracticableLog from './MVC/Controller/SubjectResponsibility/PracticableLog'

import CheckList from './MVC/View/CheckList'
import NoticeList from './MVC/Controller/NoticeList';
import NoticeAdd  from './MVC/Controller/NoticeAdd';
import NoticeDetail  from './MVC/Controller/NoticeDetail';
import ReadList  from './MVC/Controller/ReadList';
import AttachDetail  from './MVC/Controller/AttachDetail';
import ProjectList from './MVC/Controller/ProjectList';
import ProjectDetail from './MVC/Controller/ProjectDetail';
import ProjectAdd from './MVC/Controller/ProjectAdd';
import OpinionApprovalList from './MVC/Controller/OpinionApprovalList';
import OpinionWithContent from './MVC/Controller/OpinionWithContent';
import OpinionDetail from './MVC/Controller/OpinionDetail';
import OpinionAdd from './MVC/Controller/OpinionAdd';
import ApplyDelayAdd from './MVC/Controller/ApplyDelayAdd';
import ApplyInterviewAdd from './MVC/Controller/ApplyInterviewAdd';
import ApplyDutyAdd from './MVC/Controller/ApplyDutyAdd';
import ReportOpinionSummary from './MVC/Controller/ReportOpinionSummary';
import WorkReportList from './MVC/Controller/WorkReportList';
import WorkReportAdd from './MVC/Controller/WorkReportAdd';
import WorkReportDetail from './MVC/Controller/WorkReportDetail';
import WorkReportSummary from './MVC/Controller/WorkReportSummary';
import ProjectStatisticsList from './MVC/Controller/ProjectStatisticsList';
import StatisticsCharts from './MVC/Controller/StatisticsCharts';
import WorkBanchList from './MVC/Controller/WorkBanchList';
import WorkBenchWarning from './MVC/Controller/WorkBenchWarning';
import WorkBenchNoticeList from './MVC/Controller/WorkBenchNoticeList';

import AboutUs from './MVC/Controller/AboutUs';
import GroupMessageList from './MVC/Controller/GroupMessageList';
import GroupMessageAdd from './MVC/Controller/GroupMessageAdd';
import GroupMessageDetail from './MVC/Controller/GroupMessageDetail';
import EmpSelectList from './MVC/Controller/EmpSelectList';

const AppNavigator = createStackNavigator({
  Login: {screen: Login},
  Home: {
    screen: Home,
    navigationOptions: ()=>({
      headerTitle: '云督考',
      headerLeft: <View/>,
    })
  },
  Mine: {
    screen: Mine,
    navigationOptions: ()=>({
      headerTitle: '我的',
      headerLeft: null,
    })
  },
    AddFunction: {screen: AddFunction},
    IInterviewList: {screen: IInterviewList},
    AddIInterview: {screen: AddIInterview},
    IInterviewDetail: {screen: IInterviewDetail},
    CheckList: {screen: CheckList},
    ApprovalProcess: {screen: ApprovalProcess},
    SystemRecording: {screen: SystemRecording},
    BatchForms: {screen: BatchForms},
    AccountabilityList: {screen: AccountabilityList},
    AccountabilityAdd: {screen: AccountabilityAdd},
    AccountabilityDetail: {screen: AccountabilityDetail},
    AuditList: {screen: AuditList},
    AuditDetail: {screen: AuditDetail},
    AuditOptions: {screen: AuditOptions},
    RecallOption: {screen: RecallOption},
    IInterviewReleaseList: {screen: IInterviewReleaseList},
    IInterviewReleaseDetail: {screen: IInterviewReleaseDetail},
    AccountabilityReleaseList: {screen: AccountabilityReleaseList},
    AccountabilityReleaseDetail: {screen: AccountabilityReleaseDetail},
    PAppraisalList: {screen: PAppraisalList},
    PAppraisalDetail: {screen: PAppraisalDetail},
    PAppraisalViewLog: {screen: PAppraisalViewLog},
    PAppraisalApproval: {screen: PAppraisalApproval},
    FillAuditList: {screen: FillAuditList},
    FillInAuditDetail: {screen: FillInAuditDetail},
    FillInAuditOptions: {screen: FillInAuditOptions},
    IndicatorList: {screen: IndicatorList},
    PreviewList: {screen: PreviewList},
    PreviewDetail: {screen: PreviewDetail},
    PreviewLog: {screen: PreviewLog},
    PreviewSetup: {screen: PreviewSetup},
    PreviewSetupDetail: {screen: PreviewSetupDetail},
    PreviewDeptSetup: {screen: PreviewDeptSetup},
    ShowScoreList: {screen: ShowScoreList},
    ShowScoreDetail: {screen: ShowScoreDetail},
    WorkPracticable: {screen: WorkPracticable},
    PracticableLog: {screen: PracticableLog},
    GetDeptInfo: {screen: GetDeptInfo},
    SubjectDutyNoticeList: {screen: SubjectDutyNoticeList},
    SubjectDutyNoticeDetail: {screen: SubjectDutyNoticeDetail},
    SubjectDutyNoticeRead: {screen: SubjectDutyNoticeRead},
    InspectionreformList: {screen: InspectionreformList},
    InspectionreformDetail: {screen: InspectionreformDetail},
    InspectionreformLog: {screen: InspectionreformLog},
    ExchangeexperienceList: {screen: ExchangeexperienceList},
    ExchangeexperienceDetail: {screen: ExchangeexperienceDetail},
    ExchangeexperienceLog: {screen: ExchangeexperienceLog},
    InformationImprovement: {screen: InformationImprovement},
    InspectionreformInformation: {screen: InspectionreformInformation},
    DetailedListInformation: {screen: DetailedListInformation},
    DetailedList: {screen: DetailedList},
    DetailedListDetail: {screen: DetailedListDetail},
    DetailedListLog: {screen: DetailedListLog},
    DetailedListLuoShi: {screen: DetailedListLuoShi},
    PracticableInformation: {screen: PracticableInformation},
    PracticableList: {screen: PracticableList},
    PracticableDetail: {screen: PracticableDetail},
    PracticableLuoShi: {screen: PracticableLuoShi},
    ApprovalWorkList: {screen: ApprovalWorkList},
    ApprovalWorkOptions: {screen: ApprovalWorkOptions},
    KDataCloudList: {screen: KDataCloudList},
    JDataCloudList: {screen: JDataCloudList},

//公告通知
    NoticeList:  {screen: NoticeList},
    NoticeAdd:   {screen: NoticeAdd},
    NoticeDetail:   {screen: NoticeDetail},
    AttachDetail:   {screen: AttachDetail},
    ReadList : {screen:ReadList},
//立项交办
    ProjectList:  {screen: ProjectList},
    ProjectAdd:   {screen: ProjectAdd},
    ProjectDetail:   {screen:ProjectDetail},
//意见审批
    OpinionApprovalList:{screen:OpinionApprovalList},
    OpinionWithContent:{screen:OpinionWithContent},
    OpinionDetail:{screen:OpinionDetail},
    OpinionAdd:{screen:OpinionAdd},
    ApplyDelayAdd:{screen:ApplyDelayAdd},
    ApplyInterviewAdd:{screen:ApplyInterviewAdd},
    ApplyDutyAdd:{screen:ApplyDutyAdd},
    ReportOpinionSummary:{screen:ReportOpinionSummary},

  //工作汇报
    WorkReportList:{screen:WorkReportList},
    WorkReportAdd:{screen:WorkReportAdd},
    WorkReportDetail:{screen:WorkReportDetail},
    WorkReportSummary:{screen:WorkReportSummary},

//督查统计
    ProjectStatisticsList:{screen:ProjectStatisticsList},
    StatisticsCharts:{screen:StatisticsCharts},

  //工作台
  WorkBanchList:{screen:WorkBanchList},
  WorkBenchWarning:{screen:WorkBenchWarning},
  WorkBenchNoticeList:{screen:WorkBenchNoticeList},

  AboutUs:{screen:AboutUs},
  GroupMessageList:{screen:GroupMessageList},
  GroupMessageAdd:{screen:GroupMessageAdd},
  GroupMessageDetail:{screen:GroupMessageDetail},
  EmpSelectList:{screen:EmpSelectList},

},{
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    gesturesEnabled: false,
    headerStyle: {
      backgroundColor: '#38ADFF',
    },
    headerTintColor: '#fff',
    headerRight: <View/>,
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 20 * unitWidth,
      fontWeight: 'bold',
    },
    headerBackTitle: '返回',
  },
});

export default class App extends React.Component{
  render(): React.ReactNode {
    const Tab = createAppContainer(AppNavigator);
    return (
        <Tab
            ref={navigatorRef => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}/>
    )
  }
}
