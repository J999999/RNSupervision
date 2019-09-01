
// const HOST = 'http://192.168.2.45:8081/';
const HOST = 'http://221.13.156.198:10008/api/';

const URLS = {
    Login: HOST + 'login',
    UserMenu: HOST + 'admin/menu/getUserMenu',
    MailList: HOST + '/user/getUserList',
    LoginUser: HOST + '/user/getLoginUser',
    QueryListByInterview: HOST + '/implementForIA/queryListByInterview',

    QueryNoticeList: HOST + '/notice/queryList',
    AddNotice: HOST + '/notice/save',
    NoticeRecall: HOST + '/notice/recall',
    NoticeDelete: HOST + '/notice/delete',
    FileUpload: HOST + '/file/fileUpload',
    FileUploads: HOST + '/file/fileBatchUpload',
};
export default URLS;
