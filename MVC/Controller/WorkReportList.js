import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {HttpPost} from "../Tools/JQFetch";
import URLS from "../Tools/InterfaceApi";
import {screenHeight, screenWidth, unitHeight, unitWidth} from '../Tools/ScreenAdaptation';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import PopSearchview from '../View/PopSearchview'
import JQFlatList, {RefreshState} from '../View/JQFlatList'
import DataDictionary from '../Tools/DataDictionary';

var drop = false;
var context  = null;
export default class WorkReportList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '工作汇报',
    });

    constructor(props){
        super (props);
        this.internal =  '' //是否内部角色 1=是 、0=否

        context = this

        this.filter = {}
        this.state = {
            dataList:[],
            pageSize: 20,
            pageNo: 1,
            refreshState: 0,
        };
    }
    componentWillUnmount(): void {
        this.filter = {};
        drop = false;
    }

    componentDidMount(): void {
        this.internal = this.props.navigation.getParam('internal')
        drop = false;
        this._onHeaderRefresh();
     }


    _onHeaderRefresh = () => {
        this.setState({
            refreshState: RefreshState.HeaderRefreshing,
            pageSize: this.state.pageSize,
            pageNo: 1,
        }, ()=>{
            this._getListData(true);
        })
    };
    _onFooterRefresh = () => {
        if (drop){
            this.setState({
                refreshState: RefreshState.FooterRefreshing,
                pageSize: this.state.pageSize,
                pageNo: ++this.state.pageNo,
            }, ()=>{
                this._getListData(false);
            })
        }
        drop = true;
    };
    _getListData = (refresh) => {
        this.filter['pageNo'] = this.state.pageNo;
        this.filter['pageSize'] = this.state.pageSize;
        HttpPost(URLS.QueryWorkReportList,
            this.filter).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                console.log(response.data.records)
                const item = response.data.records;

                if (refresh){
                    this.setState({dataList: item, refreshState: RefreshState.Idle});
                } else {
                    if (item < 10){
                        this.setState({refreshState: RefreshState.NoMoreData})
                    } else {
                        this.setState({
                            dataList: this.state.dataList.concat(item),
                            refreshState: RefreshState.Idle,
                        })
                    }
                }
            }else {
                this.setState({refreshState: RefreshState.Failure});
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    };

    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <JQFlatList
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    data={this.state.dataList}
                    renderItem={this._renderItemAction}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 54*unitWidth}}/>}
                />
                <View style={{position: 'absolute', right: 15*unitWidth, bottom: 50*unitWidth}}>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>{this.popSearchview._show()}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange',
                            padding: 5*unitWidth, height: 54*unitWidth, width: 54*unitWidth,
                            borderRadius: 108*unitWidth}}>
                            <Image source={require('../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <PopSearchview dataSource={[
                    {'name':'标题内容', 'type':2, 'postKeyName':'queryStr'},
                    {'name':'编辑人员', 'type':2, 'postKeyName':'creatorName'},
                    {'name':'事项分类', 'type':3, 'postKeyName':'projectTypes', 'dataSource':
                            [
                                {'name': '重点项目', 'id': '1'},
                                {'name': '领导批示', 'id': '2'},
                                {'name': '决策部署', 'id': '3'},
                                {'name': '政务督查', 'id': '4'},
                                {'name': '民生实事', 'id': '5'},
                                {'name': '两代表一委员建议（议案）', 'id': '6'},
                                {'name': '其他工作', 'id': '7'},
                            ]
                    },
                    {'name':'工作属性', 'type':3, 'postKeyName':'workAttrs', 'dataSource':
                            [
                                {'name': '常规', 'id': '1'},
                                {'name': '阶段', 'id': '2'},
                                {'name': '临时', 'id': '3'},
                                {'name': '紧急', 'id': '4'},
                            ]
                    },
                    {'name':'督查状态', 'type':3, 'postKeyName':'superviseStates', 'dataSource':
                            [
                                {'name': '待审批', 'id': '1'},
                                {'name': '正常督查', 'id': '2'},
                                {'name': '待承办单位接收', 'id': '3'},
                                {'name': '暂停督查', 'id': '4'},
                                {'name': '停止督查', 'id': '5'},
                                {'name': '督查转办-待接收', 'id': '6'},
                                {'name': '已撤回', 'id': '7'},
                            ]
                    },
                    {'name':'进展情况', 'type':3, 'postKeyName':'progresses', 'dataSource':
                            [
                                {'name': '已完成', 'id': '1'},
                                {'name': '正常推进', 'id': '2'},
                                {'name': '临期', 'id': '3'},
                                {'name': '逾期', 'id': '4'},
                            ]
                    },
                    {'name':'汇报审核状态', 'type':3, 'postKeyName':'reportApprovalState', 'dataSource':
                            [
                                {'name': '无汇报', 'id': '1'},
                                {'name': '待审核', 'id': '2'},
                                {'name': '审核通过', 'id': '3'},
                                {'name': '审核驳回', 'id': '4'},
                             ]
                    },
                    {'name':'查询时间', 'type':1, 'postKeyName':'startTime' ,'postKeyNameEnd':'endTime'}
                ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(queryData)=>{
                                   this._searchOpt(queryData)
                               }}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{

        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.thumbnail}>
                    <View style={styles.view}>
                        <Text style={styles.rowTitle}>{item.projectName}</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.navigation.navigate('WorkReportAdd',{bean:item,callback:function(){
                                        context._onHeaderRefresh()
                                    }})
                            }}  >
                            <Image style={styles.image} source={require("../Images/icon_edit.png") }  />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>{ item.createTime }</Text>
                        <Text style={styles.rowSmallTitle}>编辑人：{item.creatorName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>分类：{DataDictionary.MatterTypes[item.projectType] }</Text>
                        <Text style={styles.rowSmallTitle}>属性：{DataDictionary.WorkTypes[item.workAttr]}</Text>
                    </View>

                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>督查状态：{DataDictionary.SuperViseStates[item.superviseState] }</Text>
                        <Text style={styles.rowSmallTitle}>汇报审核状态：{DataDictionary.ReportApprovalState[item.reportApprovalState]}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        )
    };

    _searchOpt=(queryData)=>{
        console.log('----'+JSON.stringify(queryData))
        for(let i in queryData){
            let item = queryData[i]
            for(let j in item){
                if(j!=='title' && j!=='name'){
                    if(item[j] instanceof  Array){
                        this.filter[j] = item[j]
                    }else{
                        this.filter[j] = item[j]
                    }
                }
            }
        }
        console.log('llllll====='+JSON.stringify(this.filter))
        this._onHeaderRefresh();
    }

    _clickCellAction = (item) => {
        this.props.navigation.navigate('WorkReportDetail', {bean: item ,callback:function(){
                context.setState({
                    ids:[]
                })
                context._onHeaderRefresh()
            }});
    };
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        height: 812 * unitHeight / 10,
        justifyContent: 'space-between',
    },
    itemLeftStyle:{
        justifyContent: 'space-between',
        marginTop: 10 * unitWidth,
        marginLeft: 10 * unitWidth,
        marginBottom: 10 * unitWidth,
    },
    itemRightStyle:{
        justifyContent: 'space-between',
        marginBottom: 10 * unitWidth,
        marginTop: 10 * unitWidth,
        marginRight: 10 * unitWidth,
    },
    thumbnail: {
        padding: 15*unitWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#D9D7D5',
        overflow: 'hidden',
        backgroundColor: "#FFF"
    },

    view:{
        flexDirection:'row',
        justifyContent:'space-between',
    },

    rowTitle: {
        fontSize: 16*unitWidth,
        color: "#2F3D4F"
    },
    rowSmallTitle: {
        fontSize: 13*unitWidth,
        marginTop: 5*unitWidth,
        color: "#A5A5AF"
    },
    rowContent: {
        fontSize: 12*unitWidth,
        marginTop: 5*unitWidth,
        color: "#A5A5AF"
    },
    button:{
        margin:8*unitWidth,
        width:(screenWidth-60*unitWidth)/2,
    },

    buttonText:{
        fontSize:16*unitWidth,
        color:'#FFF',
        padding:8*unitWidth,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#FF9900',
        borderRadius:5*unitWidth,
    },
    imageButton: {
        position: 'absolute',
        right: 12*unitWidth,
        top: 20*unitWidth,
        width: 40*unitWidth,
        height: 40*unitWidth,
    },
    image : {
        marginBottom:6*unitWidth,
        width: 28*unitWidth,
        height: 28*unitWidth,
    },
});
