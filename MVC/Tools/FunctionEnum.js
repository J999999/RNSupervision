
const  FunctionEnum = {
    defaultIcon:'placeholder',
    actionMap:{
        8: 'NoticeList',//公告通知
        9: 'GroupMessageList',//短信群发
        11:'ProjectList',//立项交办
        12:'OpinionApprovalList',//意见审批
        14:'WorkReportList' , //工作汇报
        15:'ProjectStatisticsList' , //督查统计

        20:'PAppraisalList',
        21:'FillAuditList',
        22:'PreviewList',
        23:'ShowScoreList',
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
        52:'WorkBenchNoticeList',//通知公告
        53:'WorkBenchWarning',//预警信息

        68:'IInterviewReleaseList',
        69:'AccountabilityReleaseList',

        81:'InformationImprovement',
        82:'DetailedListInformation',
        83:'PracticableInformation',
        84:'InspectionreformInformation',

        100:'KDataCloudList',
        112:'SubjectDutyNoticeList',
        107: 'InterMentionList',//约谈提起
        108: 'AccMentionList',//问责提起
        109: 'InterMentionAuditList',//约谈审核
        110: 'AccMentionAuditList',//问责审核
    },

    /**
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

        1:require('../Images/gongzuotai.png'),//工作台

        7:require('../Images/bangongoa.png'),//OA办公
        8:require('../Images/gonggaotongzhi.png'),//通知公告
        9:require('../Images/duanxinqunfa.png'),//短信群发

        10:require('../Images/ducujiandu.png'),//工作督查
        11:require('../Images/ducujiandu.png'),//工作督查
        12:require('../Images/yijianshenhe.png'),//意见审批
        13:require('../Images/yijianshenhe.png'),//承办落实
        14:require('../Images/gongzuohuibao.png'),//工作汇报
        15:require('../Images/duchatongji.png'),//督查统计

        //20.考核填报 21.填报审核 22.考核成绩预览 23.考核成绩展示
        16:require('../Images/jixiaokaohe.png'),//绩效考核
        20:require('../Images/kaohetianbao.png'),
        21:require('../Images/tianbaoshenhe.png'),
        22:require('../Images/kaohechengjiyulan.png'),
        23:require('../Images/kaohechengjizhanshi.png'),//考核成绩展示

        24:require('../Images/xiaonengwenze.png'),//效能问责
        102:require('../Images/xiaonengwenze.png'),//效能问责
        101:require('../Images/duchayuetan.png'),//督查约谈
        103:require('../Images/xiaonengshenhe.png'),//效能审核
        68:require('../Images/yuetanshixiang.png'),//约谈事项
        69:require('../Images/wenzeshixiang.png'),//问责事项

        46:require('../Images/wodeguanzhu.png') ,//我的关注
        47:require('../Images/wodepishi.png') ,//我的批示
        49:require('../Images/lingdaopishiyijian.png'),//领导批示意见
        50:require('../Images/wodeyijianjianyi.png'),//我的意见建议
        51:require('../Images/daibanshixiang.png'),//待办事项
        52:require('../Images/tongzhigonggao.png'),//通知公告
        53:require('../Images/yujingxinxi.png'),//预警信息

        29:require('../Images/zhutizeren.png'),//主体责任
        31:require('../Images/jingyanjiaoliu.png'),//经验交流
        32:require('../Images/gongzuoshenhe.png'),//工作审核
        81:require('../Images/dangzuzhixinxiweihu.png'),//党组织信息维护
        82:require('../Images/zhutizerenqingdan.png'),//主题责任清单
        83:require('../Images/zhutizerenluoshiqingkuang.png'),//主体责任落实情况
        84:require('../Images/xunchazhenggaiwanchengqingkuang.png'),//巡察整改完成情况

        44:require('../Images/ziliaoyunpan.png'),//资料云盘
        100:require('../Images/ziliaoyunpan.png'),//资料云盘
     }

};


export default FunctionEnum
