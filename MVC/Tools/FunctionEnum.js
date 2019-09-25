
const  FunctionEnum = {
    defaultIcon:'placeholder',
    actionMap:{
        1: 'NoticeList',
        8: 'NoticeList',//公告通知
        11:'ProjectList',//立项交办
        12:'OpinionApprovalList',//意见审批

        14:'WorkReportList' , //工作汇报
        15:'ProjectStatisticsList' , //督查统计

        20:'PAppraisalList',
        21:'FillAuditList',
        25:'AccountabilityList',
        26:'IInterviewList',
        27:'AuditList',

        31:'ExchangeexperienceList',
        32:'ApprovalWorkList',

        46:'WorkBanchList' ,//我的关注
        47:'WorkBanchList' ,//我的批示
        49:'WorkBanchList',//领导批示意见
        50:'WorkBanchList',//我的意见建议
        51:'WorkBanchList',//待办事项
        52:'NoticeList',//通知公告
        53:'WorkBenchWarning',//预警信息

        68:'IInterviewReleaseList',
        69:'AccountabilityReleaseList',

        81:'InformationImprovement',
        82:'DetailedListInformation',
        83:'PracticableInformation',
        84:'InspectionreformInformation',

        100:'KDataCloudList',
    },

    /**
     * 办公OA二级功能：通知公告、短信群发。

     工作督查二级功能：意见审核、立项交办（新增只做领导交办，其他不做。审核和查看需要做）、承办落实（不做手机端）、工作汇报、督查统计。

     效能问责二级功能：约谈事项、问责事项、督查约谈、效能问责、效能审核。

     绩效考核二级功能：考核类别管理（不做手机端）、考核指标管理（不做手机端）、分值权重表管理（不做手机端）、考核填报、填报审核、成绩预览和发布、考核成绩查看。

     主体责任：党组织信息完善、主体责任清单编辑、主体责任落实情况、巡察整改完成情况、经验交流、工作审核。（所有都不做手机端录入，只做查看）

     市长热线：案件登记、承办案件（待定）

     * OA办公
     *      8.通知公告 9.短信群发
     * 工作督查
     *      11.立项交办 12.意见审批 13.承办落实 14.工作汇报 15.督查统计
     * 绩效考核
     *      20.考核填报 21.填报审核 22.考核成绩预览 23.考核成绩展示
     * 效能问责
     *      25.效能问责 26.督查约谈 27.效能审核 68.约谈事项 69.问责事项
     * 主体责任
     *      31.经验交流 32.工作审核 81.党组织信息维护 82.主体责任清单 83.主体责任落实情况 84.巡察整改完成情况
     * 市长热线
     *      35.案件登记 36.承办案件
     */
    iconMap:{
        "placeholder":require('../Images/logo.png'),

        7:require('../Images/bangongoa.png'),//OA办公
        8:require('../Images/tongzhigonggao.png'),//通知公告
        9:require('../Images/duanxinqunfa.png'),//短信群发

        10:require('../Images/ducujiandu.png'),
        11:require('../Images/ducujiandu.png'),//工作督查
        12:require('../Images/yijianshenhe.png'),//意见审批
        13:require('../Images/yijianshenhe.png'),//承办落实
        14:require('../Images/yijianshenhe.png'),//工作汇报
        15:require('../Images/duchatongji.png'),//督查统计

        16:require('../Images/jixiaokaohe.png'),//绩效考核
        23:require('../Images/jixiaokaohe.png'),//考核成绩展示


        24:require('../Images/xiaonengwenze.png'),//效能问责
        27:require('../Images/xiaonengwenze.png'),//效能审核

        29:require('../Images/zhutizeren.png'),//主体责任
        31:require('../Images/logo.png'),//经验交流
        82:require('../Images/logo.png'),//主题责任清单
        83:require('../Images/logo.png'),//主体责任落实情况
        84:require('../Images/logo.png'),//巡察整改完成情况

        44:require('../Images/ziliaoyunpan.png'),//资料云盘
        45:require('../Images/logo.png'),//资料云盘
     }

}


export default FunctionEnum
