const HOST = 'http://192.168.2.42:8081/'; //岳毅
//const HOST = 'http://192.168.2.45:8081/'; //小好
//const HOST = 'http://221.13.156.198:10008/api/';

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
    NoticeRecall: HOST + '/notice/recall',
    NoticeDelete: HOST + '/notice/delete',
    FileUpload: HOST + '/file/fileUpload',
    FileUploads: HOST + '/file/fileBatchUpload',
};
export default URLS;
