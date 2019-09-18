/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
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
import AccountabilityDetail from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityDetail' //效能问责详情
import AuditList from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditList' //效能问责审核列表
import AuditDetail from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditDetail' //效能问责审核详情
import AuditOptions from './MVC/Controller/EffectivenessAccountability/EffectivenessAudit/AuditOptions' //审核操作
import IInterviewReleaseList from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewReleaseList' //约谈事项查询
import IInterviewReleaseDetail from './MVC/Controller/EffectivenessAccountability/InspectorInterview/IInterviewReleaseDetail' //约谈事项详情
import AccountabilityReleaseList from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityReleaseList' //问责事项查询
import AccountabilityReleaseDetail from './MVC/Controller/EffectivenessAccountability/EA/AccountabilityReleaseDetail' //问责事项详情



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

    NoticeList:  {screen: NoticeList},
    NoticeAdd:   {screen: NoticeAdd},
    NoticeDetail:   {screen: NoticeDetail},
    AttachDetail:   {screen: AttachDetail},
    ReadList : {screen:ReadList},

    ProjectList:  {screen: ProjectList},
    ProjectAdd:   {screen: ProjectAdd},
    ProjectDetail:   {screen:ProjectDetail},

    OpinionApprovalList:{screen:OpinionApprovalList},
    OpinionWithContent:{screen:OpinionWithContent},
    OpinionDetail:{screen:OpinionDetail},
    OpinionAdd:{screen:OpinionAdd},
    ApplyDelayAdd:{screen:ApplyDelayAdd},
    ApplyInterviewAdd:{screen:ApplyInterviewAdd},
    ApplyDutyAdd:{screen:ApplyDutyAdd},
    ReportOpinionSummary:{screen:ReportOpinionSummary},

    WorkReportList:{screen:WorkReportList},
    WorkReportAdd:{screen:WorkReportAdd},
    WorkReportDetail:{screen:WorkReportDetail},
    WorkReportSummary:{screen:WorkReportSummary},

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
