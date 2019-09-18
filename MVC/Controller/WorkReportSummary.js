import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    Image, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from 'react-native-overlayer/src';
import DataDictionary from '../Tools/DataDictionary';
import {unitHeight, unitWidth} from '../Tools/ScreenAdaptation';
import ExpandableList from 'react-native-expandable-section-flatlist';
import EditDialogWidget from '../Widget/EditDialogWidget';
import AsyncStorage from '@react-native-community/async-storage';

var screenWidth = Dimensions.get('window').width;
var context ;

/**
 * 工作汇报批示，只有驳回的数据可修改，其他的只查看
 */
class WorkReportSummary extends Component {

    constructor(props){
        super(props);
        context = this;
        this.bean = null;
        this.infoCode = '1';
        this.expendList = null;
        this.internal = ''////是否内部角色 1=是 、0=否

        this.reportId = '',//汇报或建议ID
        this.type = '' ,//回复类型
        this.state = {
            summaryData:null,//汇总
            opinionInternalData:null,//督察局
            opinionData:null, //领导批示
            unitData:null, //牵头
            unitAssistData:null,//配合
            switchTab:false,
            show:false,
        }
    };

    componentDidMount(): void {
        AsyncStorage.getItem('internal').then((value) => {
            this.internal = JSON.parse(value)
        });
        this.getReportSummaryInfo()
    }

    renderTabItem(code, label) {
        return <TouchableOpacity style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                                 onPress={() => {
                                     this.infoCode = code
                                     this.setState({
                                         switchTab:true
                                     })
                                 }}
        >
            <Text
                style={{
                    color: this.infoCode === code ? '#38ADFF' : "#999999",
                    fontSize: 16*unitWidth,
                    paddingVertical:  15*unitWidth ,
                }}>{label}</Text>
        </TouchableOpacity>;
    }

    renderViewContent=()=>{
        return this.renderItemData(this.infoCode)
    }

    renderItemData=(code)=>{
        switch (code) {
            case  '1':
                if(this.state.summaryData==null ){
                    this.getReportSummaryInfo()
                }else{
                    if(this.state.summaryData.length <1){
                        return this.renderBlank()
                    }else{
                        return  this.renderSummaryData(this.state.summaryData)
                    }
                }
                break;
            case  '2':
                if(this.state.opinionData==null ){
                    this.getReportOpinionQuery(0)
                }else{
                    if(this.state.opinionData.length <1){
                        return this.renderBlank()
                    }else {
                        return this.renderSummaryData(this.state.opinionData)
                    }
                }
                break;
            case  '3':
                if(this.state.opinionInternalData ==null ){
                    this.getReportOpinionQuery(1)
                }else{
                    if(this.state.opinionInternalData.length <1){
                        return this.renderBlank()
                    }else{
                        return  this.renderSummaryData(this.state.opinionInternalData)
                    }
                }
                break;
            case  '4':
                if(this.state.unitData == null ){
                    this.getUnitInfo()
                }else{
                    if(this.state.unitData.length <1){
                        return this.renderBlank()
                    }else{
                        return  this.renderSummaryData(this.state.unitData)
                    }
                }
                break;
            case  '5':
                let ids = []
                for(let i in this.bean.dutyUnitList) {
                    if(this.bean.dutyUnitList[i].unitType == 2 ){
                        ids.push(this.bean.dutyUnitList[i].unitId)
                    }
                }
                if(ids.length <1){
                    return this.renderBlank()
                }

                if(this.state.unitAssistData ==null){
                    this.getUnitAssistInfo(ids)
                }else{
                    if(this.state.unitAssistData.length <1){
                        return this.renderBlank()
                    }else{
                        return  this.renderUnitAssist()
                    }
                }
                break;
            default:
                break;
        }
    }

    renderSummaryData=(dataList)=>{
        var itemViews =[]

        for(let i  in dataList){
            let item = dataList[i];

            var fileViews = []
            if(item.fileList!=null){
                fileViews.push(this.renderFileList(item.fileList))
            }

            if(item.recordType == 1){ //批示意见

                //是外部人员且 外部不可见
                if(this.internal==0 && item.externalVisibility == 0){
                    break;
                }

                let view = (
                    <View >
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>批示时间：{item.createTime}</Text>
                            <Text style={styles.titleInfo}>批示人：{item.userName}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>批示内容：{item.opinion}</Text>
                        </View>

                        {fileViews}

                        <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

                    </View>
                );

                itemViews.push(view)
            }
            if(item.recordType == 2){ //工作汇报

                var approveView = []

                var modifyview = []
                if(item.approveState == 99){
                    modifyview =  <View style={[styles.view,{justifyContent:'flex-end'}]}>
                        { this.renderModifyBtn(item) }
                    </View>
                }

                if(item.approveState!=0){ // 审批过
                    approveView.push(
                        <View>
                            <View style={styles.view}>
                                <Text style={styles.titleInfo}>审批状态：{DataDictionary.ApprovalState[item.approveState]}</Text>
                                <Text style={styles.titleInfo}>审批人：{item.approveUserName}</Text>
                            </View>
                            <View style={styles.view}>
                                <Text style={styles.titleInfo}>审批意见：{item.suggestion}</Text>
                            </View>
                            {modifyview}
                        </View>
                    )
                }else{
                    approveView.push(<View style={styles.view}>
                        <Text style={styles.titleInfo}>审批状态：{DataDictionary.ApprovalState[item.approveState]}</Text>
                    </View>)
                }

                let view = (
                    <View >
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>汇报节点：{item.reportNode}</Text>
                            <Text style={styles.titleInfo}>汇报时间：{item.reportTime}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>汇报类型：{item.reportType==1?'进度汇报':'完成汇报'}</Text>
                            <Text style={styles.titleInfo}>汇报标题：{item.reportTitle}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>汇报人：{item.reportUserName}</Text>
                            <Text style={styles.titleInfo}>汇报单位：{item.reportUnitName}</Text>
                        </View>
                        <View style={styles.view}>
                            <Text style={styles.titleInfo}>汇报内容：{item.reportContent}</Text>
                        </View>
                        {approveView}
                        {fileViews}
                        <View style={{height: 4*unitWidth, backgroundColor: '#f5f5f5'}}/>

                    </View>
                );
                itemViews.push(view)
            }
        }

        return <ScrollView style={styles.main}>
            {itemViews}

        </ScrollView>
    }

    renderModifyBtn=(item)=>{
        return <Button style={styles.button} title="修改" onPress={()=>{
            this.props.navigation.navigate('WorkReportAdd',{bean:item,callback:function(){
                    context.getReportSummaryInfo()
                }})
        }} />
    }

    renderFileList=(list)=>{
        var fileViews = []
        for(let i in list ){
            let file = list[i]
            let view = (
                    <View style={styles.view}>
                        <Text style={styles.titleInfo}>附件：</Text>
                        <Text style={styles.titleInfo}>{file.name}</Text>
                    </View>
            );
            fileViews.push(view)
        }
        return fileViews
    }

    renderBlank = () => <View style={[this.props.style, {flex: 1, alignItems: 'center', backgroundColor: '#fff'}]}>

        <Text style={{fontSize: 13*unitWidth, color: '#999999', marginTop: 15*unitWidth}}> 暂无内容 </Text>

    </View>;

    renderUnitAssist=()=>{

        if(this.expendList == null){
            this.expendList = []
            for(let i in this.bean.dutyUnitList) {
                if(this.bean.dutyUnitList[i].unitType == 2 ){
                    let item ={}
                    item['id'] = this.bean.dutyUnitList[i].unitId
                    item['name']=this.bean.dutyUnitList[i].unitName
                    var objs = this.state.unitAssistData
                    Object.keys(objs).forEach(function(key){
                        console.log(key,objs[key]);
                        if(item.id == key){
                            item['children'] = []
                            item.children.push(objs[key])
                        }
                    });
                    this.expendList.push(item)
                }
            }
        }

        return (
            <View style={{flex: 1}}>
                <ExpandableList
                    dataSource={this.expendList}
                    ref={instance => this.ExpandableList = instance}
                    headerKey={'name'}
                    memberKey={'children'}
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0]}
                    rowNumberCloseMode={0}
                />
            </View>
        );
    }

    _renderSection = (section, sectionId)  => {
        return (
            <View style={{height: 54*unitHeight, borderBottomWidth: unitHeight, flexDirection:'row',
                alignItems: 'center', borderBottomColor: '#F4F4F4', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center',padding:4}}>
                    <Text style={{marginLeft: 10*unitWidth, fontSize: 16*unitWidth}}>{section}</Text>
                </View>
                <Image source={require('../Images/goRight.png')}
                       style={{width: 16*unitWidth, height: 16*unitWidth, marginRight: 10*unitWidth}}/>
            </View>
        );

    }

    /**
     * <View style={{height:100,width:'100%'}}>
     <ScrollView>
     * @param rowItem
     * @param rowId
     * @param sectionId
     * @returns {*}
     * @private
     */
    _renderRow = (rowItem, rowId, sectionId) => (
        <ScrollView style={{height:300*unitWidth,width:'100%',marginLeft:4*unitWidth}}>
            {this.renderSummaryData(this.expendList[sectionId].children[rowId])}
        </ScrollView>
    )

    /**
     * 牵头单位信息
     */
    getUnitInfo() {
        HttpPost(URLS.LeadingUnitOpinionQuery,{id:this.bean.id,unitId:''},"正在查询").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.setState({
                    unitData:response.data
                })
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    /**
     * 配合单位汇报信息
     */
    getUnitAssistInfo(ids) {

        HttpPost(URLS.LeadingUnitOpinionQueryV2,{id:this.bean.id,unitIds:ids},"正在查询").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.setState({
                    unitAssistData:response.data
                })
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    /**
     * 意见
     */
    getReportOpinionQuery(internal){
       let theinternal = internal
        HttpPost(URLS.OpinionQuery,{'projectId':this.bean.id,'internal':internal},"").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                if(theinternal == 1){
                    this.setState({
                        opinionInternalData : response.data
                    })
                }else{
                    this.setState({
                        opinionData:response.data,
                    })
                }

            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    /**
     * 汇总
     */
    getReportSummaryInfo(){
        HttpPost(URLS.ReportOpinionQuery,{id:this.bean.id},"").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                this.setState({
                    summaryData:response.data
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }
    static  navigationOptions = ({navigation}) =>({
        title: '批示汇总',
    });

    /**
     *保存意见和回复
     */
    saveOpinionOrReply(id,opinion){
        HttpPost(URLS.OpinionSave, {opinion:opinion,replyState:1,replyRecordId:id}, '正在提交...').then((response) =>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.resetData()
            }
        }).catch((error)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }

    /**
     * 审批工作汇报
     * result 审批结果（1-审批通过 99-驳回）
     */
    approvelWorkReport(id,suggestion,result){
        HttpPost(URLS.ApprovelWorkReport, {reportId:id,suggestion:suggestion,result:result}, '正在提交...').then((response) =>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.resetData()
            }
        }).catch((error)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }
    /**
     * 回复工作汇报
     *"content": "回复内容",
     "reportId": 1
     */
    replyWorkReport(id,content ){
        HttpPost(URLS.ReplyWorkReport, {reportId:id,content:content}, '正在提交...').then((response) =>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.resetData()
            }
        }).catch((error)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }

    resetData(){

        this.expendList = null;

        this.setState({
            summaryData:null,//汇总
            opinionInternalData:null,//督察局
            opinionData:null, //领导批示
            unitData:null, //牵头
            unitAssistData:null,//配合
        })
    }

    render(){
        const  {params} = this.props.navigation.state;

        if(params && this.bean==null) this.bean = params.bean

        console.log(this.bean)

        return (
            <View style = {styles.all}>
                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

                <View style={{flexDirection: 'row'}}>
                    {this.renderTabItem("1", '汇总')}
                    {this.renderTabItem("2", '领导批示')}
                    {this.renderTabItem("3", '督察局')}
                    {this.renderTabItem("4", '牵头单位')}
                    {this.renderTabItem("5", '配合单位')}
                </View>

                <View style={{height: 10*unitWidth, backgroundColor: '#f5f5f5'}}/>

                {
                    this.renderViewContent()
                }

            </View>

        );
    }

}


var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#fff',
    },

    scroll:{
        backgroundColor:'#fff',
        paddingTop:15*unitWidth,
    },

    main:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        // alignItems: "center",
        // justifyContent: "center"
    },

    title:{
        color:'#000000',
        fontSize:20*unitWidth,
        marginBottom:8*unitWidth,
        marginLeft:8*unitWidth,
        marginRight:8*unitWidth,
    },

    titleInfo:{
        alignSelf:'flex-start',
        color:'#666',
        fontSize:14*unitWidth,
    },

    content:{
        alignSelf:'flex-start',
        marginLeft:8*unitWidth,
        marginRight:8*unitWidth,
        marginTop:10*unitWidth,
        fontSize:16*unitWidth,
    },

    font:{
        fontSize:14*unitWidth,
        color:'orange',
    },

    line:{
        height:0.5*unitWidth,
        margin:5*unitWidth,
        width:600*unitWidth,
        backgroundColor:'gray',
    },

    view:{
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#ffffff',
        padding:8*unitWidth,
    },

    button:{
        fontSize:15*unitWidth,
        color:'#FFF',
        padding:8*unitWidth,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5*unitWidth,
    }

})

module.exports = WorkReportSummary
