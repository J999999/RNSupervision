import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RefreshState} from "../../View/JQFlatList";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import JQFlatList from "../../View/JQFlatList";
import {unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import PopSearchview from '../../View/PopSearchview'

var search = {}; //查询参数
var drop = false;
var _that ;
export default class PAppraisalList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '考核填报',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>
                { navigation.getParam('isInSelect') ? '完成' : '批量上报' }
            </Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.setState({
            isChecks: !this.state.isChecks,
        }, ()=>{
            this.props.navigation.setParams({ isInSelect: this.state.isChecks });
        });
        if (this.state.ids.length === 0) {
            return;
        }
        if (this.state.isChecks === true){
            HttpPost(URLS.reportBatchFillin, {ids: this.state.ids}, '正在上传...').then((response)=>{
                RRCToast.show(response.msg);
                if (response.result === 1) {
                    this._onHeaderRefresh();
                }
            }).catch((err)=>{
                RRCAlert.alert('服务器内部错误')
            })
        }
    };
    constructor(props){
        super (props);
        _that = this;
        this.state = {
            dataList: [],
            refreshState: 0,
            pageSize: 11,
            pageNo: 1,
            isChecks:false,            //是否多选
            ids: [],                   //多选时，存储id，用来审核
        };
    }
    componentWillUnmount(): void {
        search = {};
        drop = false;
    }

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
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
        search['pageNo'] = this.state.pageNo;
        search['pageSize'] = this.state.pageSize;
        HttpPost(URLS.ListPageFillin,
            search).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data.records;
                if (item.length > 0) {
                    item.map((i)=>{
                        i['select'] = false;
                    })
                }
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
        return(
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
                            <Image source={require('../../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <PopSearchview dataSource={[
                    {'name':'权重表名称', 'type':2, 'postKeyName':'swName'},
                    {'name':'指标名称', 'type':2, 'postKeyName':'indicatorName'},
                    {'name':'下发时间', 'type':1, 'postKeyName':'startTime', 'postKeyNameEnd':'endTime'},
                    {'name':'状态查询', 'type':3, 'postKeyName':'statusArray', 'dataSource':
                            [
                                {'name': '未填报', 'id': 1},
                                {'name': '填报已保存', 'id': 2},
                                {'name': '已上报待审核', 'id': 3},
                                {'name': '审核通过', 'id': 4},
                                {'name': '审核驳回', 'id': 5},
                                {'name': '已过期', 'id': 6},
                            ]
                    },
                ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(c)=>{this._searchAction(c)}}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        let recordState = '';
        switch (item.status) {
            case 1:
                recordState = '未填报';
                break;
            case 2:
                recordState = '填报已保存';
                break;
            case 3:
                recordState = '已上报待审核';
                break;
            case 4:
                recordState = '审核通过';
                break;
            case 5:
                recordState = '审核驳回';
                break;
            case 6:
                recordState = '已过期';
                break;
        }
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.swName}</Text>
                        <Text>{item.indicatorName}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{recordState}</Text>
                        <Text>{item.assignTime}</Text>
                    </View>
                    {
                        this.state.isChecks === true ?
                            item.select === true ?
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../Images/select_right.png')}
                                           style={{height: 15*unitWidth, width: 15*unitWidth, marginRight: 10*unitWidth}}
                                    />
                                </View>
                                :null
                            : null
                    }
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        //操作按钮  status 1.填报 2.查看/编辑/上报 3/4.查看  5.查看/编辑
        if (this.state.isChecks === false){
            this.props.navigation.navigate('PAppraisalDetail', {item, callback: function () {
                _that._onHeaderRefresh();
                }});
        } else {
            let arr = [];
            let idsArr = [];
            arr = arr.concat(this.state.dataList);
            idsArr = idsArr.concat(this.state.ids);
            arr.map((i)=>{
                console.log(i);
                if (i.status === 2){
                    if (i.id === item.id){
                        i.select = !item.select;
                        i.select === true ? idsArr.push(i.id) : idsArr.splice(idsArr.indexOf(i.id), 1);
                    }
                }
            });
            this.setState({dataList: arr, ids: idsArr});
        }
    };
    _searchAction = (info) => {
        search = {};
        let searchArr = [];
        searchArr = searchArr.concat(info);
        searchArr.map((i)=>{
            if (i.startTime)
                search['startTime'] = i.startTime;
            if (i.endTime)
                search['endTime'] = i.endTime;
            if (i.swName)
                search['swName'] = i.swName;
            if (i.statusArray)
                search['statusArray'] = i.statusArray;
            if (i.indicatorName)
                search['indicatorName'] = i.indicatorName;
        });
        this._onHeaderRefresh();
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
});
