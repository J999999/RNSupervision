
// const HOST = 'http://192.168.2.45:8081/';
const HOST = 'http://192.168.2.42:8081/';
// const HOST = 'http://221.13.156.198:10008/api/';

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



};
export default URLS;
