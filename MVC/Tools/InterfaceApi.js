//const HOST = 'http://192.168.2.48:8081/'; //岳毅
//const HOST = 'http://192.168.2.47:8081/'; //小好
const HOST = 'http://221.13.156.198:10008/api/';

const URLS = {
    Login: HOST + 'login',
    UserMenu: HOST + 'admin/menu/getUserMenu',
    MailList: HOST + '/user/getUserList',
    LoginUser: HOST + '/user/getLoginUser',
    //效能问责相关接口
    QueryListByInterview: HOST + '/implementForIA/queryListByInterview', //约谈查询
    AddIAImplementInfo: HOST + '/implementForIA/addIAImplementInfo', //新增约谈实施事项
    QueryInfoById : HOST + '/implementForIA/queryInfoById', //查询单个约谈详情
    ModifyIAImplementInfo : HOST + '/implementForIA/modifyIAImplementInfo', //修改约谈问责实施事项
    QueryLogList : HOST + '/implementForIAForApproval/queryLogList', //约谈审批流程
    QueryInfoLogById : HOST + '/implementForIA/queryInfoLogById', //约谈系统记录
    QueryTPIAApplicationById : HOST + '/implementForIA/queryTPIAApplicationById', //约谈呈批表
    ApplyReleaseInfo : HOST + '/implementForIA/applyReleaseInfo', //提请发布审核
    RecallInfo : HOST + '/implementForIA/recallInfo', //撤回发布
    ReleaseInfo :HOST + '/implementForIA/releaseInfo', //发布内容
    QueryListByAccountability : HOST + '/implementForIA/queryListByAccountability', //问责查询
    QueryList : HOST + '/implementForIA/queryList', //效能审核列表
    AgreeApproval : HOST + '/implementForIAForApproval/agreeApproval', //审批同意
    RejectApproval : HOST + '/implementForIAForApproval/rejectApproval', //审批驳回
    QueryReleaseAccountability : HOST + '/implementForIA/queryReleaseAccountability', //问责事项查询
    QueryReleaseInterview : HOST + '/implementForIA/queryReleaseInterview', //约谈事项查询
    //绩效考核
    ListPageFillin: HOST + 'assess/fillin/listPage', //绩效考核列表
    ListDetailFillin : HOST + 'assess/fillin/listDetailInfo', //绩效考核详情
    SaveFillin : HOST + 'assess/fillin/save',//填报保存，编辑，上报
    reportByIdFillin : HOST + 'assess/fillin/reportById',//点击某条单独上报
    reportBatchFillin : HOST + 'assess/fillin/reportBatch',//批量上报
    IndicatorList: HOST + 'assess/indicator/listPage', //考核指标列表
    ViewLogFillin : HOST + 'assess/scoreWeight/approvalViewLog', //查看系统记录
    ApprovalFillin : HOST + 'assess/scoreWeight/queryApproval', //查看审核信息
    ApproveListFillin: HOST + 'assess/scoreWeight/approveList', //填报审核列表
    ApproveDetailFillin : HOST + 'assess/scoreWeight/listDetailInfo', //填报审核详情
    UpApproveFillin : HOST + 'assess/scoreWeight/approve', //填报审核
    QueryListPublish: HOST + 'assess/publish/queryList',//成绩预览列表
    PreviewScorePublish: HOST + 'assess/publish/previewScore',// 预览详情
    PreviewLog: HOST + 'assess/publish/getLog', //预览系统记录
    ReleasePublish: HOST + 'assess/publish/publishScoreList' , //考核成绩批量发布
    BackPublish: HOST + 'assess/publish/recallList' , //考核成绩批量撤回
    ReleasePublishOne: HOST + 'assess/publish/publishScore', //考核成绩单个发布
    BackPublishOne : HOST + 'assess/publish/recall', //单个撤回
    GetBaseSetup : HOST + 'assess/publish/getBaseSetup', //'获取分值权重发布设置基本信息'
    SaveBaseSetup : HOST + 'assess/publish/saveBaseSetup', //保存分值权重发布设置基本信息
    GetDeptSetup : HOST + 'assess/publish/getDeptSetup', //分值权重表加分项设置
    SaveDeptSetup : HOST + 'assess/publish/saveDeptSetup', //考核单位加分项设置保存
    //主体责任
    QueryListByInspectionreform : HOST + 'inspectionreform/queryList', //巡查整改列表
    QueryDetailByInspectionreform : HOST + 'inspectionreform/queryDetail', //巡查整改详情
    QueryLogByInspectionreform: HOST + 'inspectionreform/queryLog', //巡查整改系统记录
    QueryListByExchangeexperience : HOST + 'exchangeexperience/queryList', //经验交流列表
    QueryDetailByExchangeexperience : HOST + 'exchangeexperience/queryDetail', //经验交流详情
    QueryLogByExchangeexperience: HOST + 'exchangeexperience/queryLog', //经验交流系统记录
    QueryPartyInfoByParam : HOST + 'partyOrganizationInfo/queryPartyInfoByParam', //获取党组织信息
    QueryPageList : HOST + 'subjectDutyInventory/queryPageList', //主体责任清单列表
    GetSubjectDutyById : HOST + 'subjectDutyInventory/getSubjectDutyById', //主体责任清单详情
    GetSubjectDutyLogById : HOST + 'subjectDutyInventory/getSubjectDutyLogById', //主体责任清单系统记录
    GetDutyByDutyInventoryId: HOST + 'subjectDutyPracticable/getDutyByDutyInventoryId', //获取主体责任清单落实
    QueryListByDutyPracticable: HOST + 'subjectDutyPracticable/queryPageList', //获取主体责任落实情况列表
    QueryListByApprovalWork : HOST + 'approvalWork/queryPageList', //主体责任 工作审核
    ApproveBatch : HOST + 'approvalWork/approveBatch', //工作审核 审核
    //资料云盘
    GetDataCloud : HOST + 'cloudDisk/queryList',  //获取资料云盘列表
    SaveDataCloud : HOST + 'cloudDisk/save', //上传资料云盘
    DeleteDataCloud : HOST + 'cloudDisk/delete', //删除资料云盘


    QueryNoticeList: HOST + '/notice/queryList',
    AddNotice: HOST + '/notice/save',
    NoticeDetail: HOST + '/notice/queryDetail', // 根据ID查看详情
    NoticeRecall: HOST + '/notice/recall',
    NoticeDelete: HOST + '/notice/delete',
    FileUpload: HOST + '/file/fileUpload',
    FileUploads: HOST + '/file/fileBatchUpload',
    //立项交办
    QueryProjectList: HOST + '/projectInfo/getProjectInfoList',
    SubmitProject: HOST + '/projectInfo/addSubmitAudit', //提交立项数据
    SaveProject: HOST + '/projectInfo/saveOrUpdate', //保存立项信息
    ProjectDetail: HOST + '/projectInfo/getProjectInfo', // 根据ID查看详情
    ProjectRecall: HOST + '/projectInfo/revokeProject',//撤回
    ProjectDelete: HOST + '/projectInfo/deleteProject',
    SysLog: HOST + '/projectInfo/getSystemLog', //立项交办，系统记录
    QueryApproval:HOST + '/projectApproval/queryLogList',//查询审批流程
    GetParamDept:HOST + '/admin/dept/getParamDept' ,//根据条件获取一级部门 ,查牵头单位或配合单位


    ProjectApprovalList:HOST + '/projectApproval/queryList' ,// 意见审批查询列表
    ProjectApprovalAgree:HOST + '/projectApproval/agreeProject',// 意见审批同意
    ProjectApprovalReject:HOST + '/projectApproval/rejectProject',// 意见审批驳回
    OpinionSave:HOST + '/projectApproval/saveOpinion',//意见建议/批示/回复保存接口

    ProjectApplicationSave:HOST + '/applicationForPIA/addApplication',//提起延期申请，约谈申请，问责申请

    DeleteProjectRelation:HOST + '/follow/projectRelation/deleteProjectRelation',//取消事项关注
    AddProjectRelation:HOST + '/follow/projectRelation/saveProjectRelation',//添加事项关注

    ProjectDelaySave:HOST + '/projectApproval/delayedProject',//事项延期
    ProjectDutySave:HOST + '/projectApproval/accountabilityProject',//事项问责
    ProjectInterviewSave:HOST + '/projectApproval/interviewProject',//事项约谈

    ReportOpinionQuery:HOST + '/projectApproval/queryAllReportOpinionList',//批示汇报汇总查询
    LeadingUnitOpinionQuery:HOST + '/projectApproval/queryLeadingUnitOpinionList',//查询牵头单位汇报与批示回复
    LeadingUnitOpinionQueryV2:HOST + '/projectApproval/queryLeadingUnitOpinionListV2',//查询汇报单位汇报与批示回复
    OpinionQuery:HOST + '/projectApproval/queryOpinionList',//查询意见批示


    ApprovelWorkReport:HOST + '/workReport/approveWorkReport',//审批工作汇报
    ReplyWorkReport:HOST + '/workReport/reply',//回复工作汇报
    QueryWorkReportList:HOST + '/workReport/queryProjectList',//分页查询工作汇报项目列表
    SaveWorkReport:HOST + '/workReport/save',//保存工作汇报
    WorkReportTimeNodes:HOST + '/workReport/listReportTime',//根据项目ID获取当前汇报单位的汇报节点

    StatisticsUser:HOST + '/project/statistics/pic',//责任人统计
    StatisticsProject:HOST + '/project/statistics/projectInfo',//立项统计
    StatisticsUnit:HOST + '/project/statistics/respUnit',//责任单位统计


    StatisticsWorkbenchProject:HOST + '/project/statistics/workbenchProject',//预警信息统计
    WorkBenchQueryLeaderOpinion:HOST + '/workbench/queryLeaderOpinion',//领导的批示/领导的批示意见
    WorkBenchQueryMyFollow:HOST + '/workbench/queryMyFollow',//我的关注
    WorkBenchQueryMyOpinion:HOST + '/workbench/queryMyOpinion',//我的批示/我的意见建议
    WorkBenchQueryTodoList:HOST + '/workbench/queryTodoList',//待办事项
    WorkBenchSaveRead:HOST + '/workbench/saveWorkbenchRead',//标记阅读状态



};
export default URLS;
