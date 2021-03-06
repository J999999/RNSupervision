
const  DataDictionary = {

    /**
     * 立项交办---事项分类
     */
    MatterTypes:{
        1:'重点项目',
        2:'领导批示',
        3:'决策部署',
        4:'政务督查',
        5:'民生实事',
        6:'建议提案',
        7:'其他工作',
    },

    /**
     * 工作属性：1-常规，2-阶段，3-临时，4-紧急
     */
    WorkTypes:{
        1:'常规',
        2:'阶段',
        3:'临时',
        4:'紧急',
    },
    /**
     * 所属类别
     */
    BelongTypes:{
        1:'省',
        2:'郑州市',
        3:'新郑市',
    },

    /**
     * 进展情况
     */
    ProgressTypes:{
        1: '已完成',
        2: '正常推进',
        3: '临期',
        4: '逾期',
    },
    /**
     * 督查状态
     */
    SuperViseStates:{
        1:'待审批',
        2:'正常督查',
        3:'待承办单位接收',
        4:'暂停督查',
        5:'停止督查',
        6:'督查转办待接收',
        7:'已撤回',
        8:'审核驳回',
    },

    /**
     * 时间设置
     */
    TimeUnitTypes:{
        // 1: '半天',
        2:'天',
        3:'工作日',
        4:'周',
        5:'月',
        6:'季度',
    },

    /**
     * 时间
     */
    TimeValue:{
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        10: 10,
        11: 11,
        12: 12,
        13: 13,
        14: 14,
        15: 15,
    },

    /**
     * 汇报模式
     */
    ReportModes:{
        1: '周期汇报',
        2: '固定时间点汇报',
    },

    /**
     * 汇报时间设定
     */
    ReportTimeSet:{
        1: '单独设置',
        2: '与牵头单位一致',
    },
    /**
     * 【立项交办，意见审核】审批状态
     */
    ApprovalTypes:{
        1: '未提交',
        2: '待审批',
        3: '审批中',
        4: '审批通过',
        5: '驳回',
    },
    /**
     * 关注状态
     */
    FollowStates:{
        1: '关注',
        2: '未关注',
    },
    /**
     * 钱单位  1-万，2-亿
     */
    MoneyUnit:{
        1: '万',
        2: '亿',
    },
    /**
     * 【工作汇报】审核状态
     * （0-待审核 ，1-审核通过，99-审核驳回）
     */
    ApprovalState:{
        0:'待审核',
        1:'审核通过',
        99:'审核驳回',
    },

    ReportApprovalState:{
        1:'无汇报',
        2:'待审核',
        3:'审核通过',
        4:'审核驳回',
    },

    getIndexValue : function (list,value) {
        for(var i = 0; i < list.length; i++){
            if (list[i] == value){
                return i;
            }
        }
    }
}


export default DataDictionary
