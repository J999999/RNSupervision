
const HOST = 'http://192.168.2.45:8081/';
// const HOST = 'http://221.13.156.198:10008/yundukao/';

const URLS = {
    Login: HOST + 'login',
    UserMenu: HOST + 'admin/menu/getUserMenu',
    QueryNoticeList: HOST + '/notice/queryList',
    AddNotice: HOST + '/notice/save',
    NoticeRecall: HOST + '/notice/recall',
    NoticeDelete: HOST + '/notice/delete',
    FileUpload: HOST + '/fileUpload/upload',
};
export default URLS;
