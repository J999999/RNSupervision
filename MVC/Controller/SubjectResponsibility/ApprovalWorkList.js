import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import JQFlatList, {RefreshState} from "../../View/JQFlatList";
import {unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import PopSearchview from '../../View/PopSearchview'

var search = {}; //查询参数
var drop = false;
export default class ApprovalWorkList extends React.Component{
    static navigationOptions = {
        title: '工作审核',
    };

    constructor(props){
        super (props);
        this.state = {
            dataList: [],
            refreshState: 0,
            pageSize: 11,
            pageNo: 1,
        }
    }
    componentWillUnmount(): void {
        search = {};
        drop = false;
    }

    componentDidMount(): void {
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
        HttpPost(URLS.QueryListByApprovalWork,
            search).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
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
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 10*unitWidth}}/>}
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
                    {'name':'内容', 'type':2, 'postKeyName':'queryStr'},
                    {'name':'审核状态', 'type':3, 'postKeyName':'approveStates', 'dataSource':
                        [
                            {'name': '已保存', 'id': 0},
                            {'name': '待审核', 'id': 1},
                            {'name': '审核通过', 'id': 2},
                            {'name': '驳回', 'id': 99}
                        ]
                    },
                    {'name':'审核类别', 'type':3, 'postKeyName':'approveTypes', 'dataSource':
                        [
                            {'name': '主体责任清单', 'id': 1},
                            {'name': '主体责任清单落实', 'id': 2},
                            {'name': '巡查整改完成情况', 'id': 3},
                            {'name': '经验交流', 'id': 4}
                        ]
                    },
                    {'name':'登记时间', 'type':1, 'postKeyName':'createStartTime', 'postKeyNameEnd':'createEndTime'},
                ]}
                ref={ref => this.popSearchview = ref}
                callback={(c)=>{this._searchAction(c)}}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        let progressStr = '';
        switch (item.approveType) {
            case 1:
                progressStr = '主体责任清单';
                break;
            case 2:
                progressStr = '主体责任清单落实';
                break;
            case 3:
                progressStr = '巡察整改完成情况';
                break;
            case 4:
                progressStr = '经验交流';
                break;
        }
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.creatorName}</Text>
                        <Text numberOfLines={0}>{item.itemContent}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{progressStr}</Text>
                        <Text style={{textAlign: 'right'}}>{item.createTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        let hasButton = false;
        item.approveState === 1 ? hasButton = true : hasButton = false;
        switch (item.approveType) {
            case 1:
                this.props.navigation.navigate('DetailedListDetail', {
                    id: item.id,
                    hasButton: hasButton,
                    approveType: item.approveType,
                });
                break;
            case 2:
                this.props.navigation.navigate('PracticableDetail', {
                    id: item.id,
                    hasButton: hasButton,
                    approveType: item.approveType,
                });
                break;
            case 3:
                this.props.navigation.navigate('InspectionreformDetail', {
                    id: item.id,
                    hasButton: hasButton,
                    approveType: item.approveType,
                });
                break;
            case 4:
                this.props.navigation.navigate('ExchangeexperienceDetail', {
                    id: item.id,
                    hasButton: hasButton,
                    approveType: item.approveType,
                });
                break;
        }
    };
    _searchAction = (info) => {
        search = {};
        let searchArr = [];
        searchArr = searchArr.concat(info);
        searchArr.map((i)=>{
            if (i.queryStr)
                search['queryStr'] = i.queryStr;
            if (i.approveTypes)
                search['approveTypes'] = i.approveTypes;
            if (i.approveStates)
                search['approveStates'] = i.approveStates;
            if (i.createStartTime)
                search['createStartTime'] = i.createStartTime;
            if (i.createEndTime)
                search['createEndTime'] = i.createEndTime;
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
        width: 210*unitWidth,
    },
    itemRightStyle:{
        justifyContent: 'space-between',
        marginBottom: 10 * unitWidth,
        marginTop: 10 * unitWidth,
        marginRight: 10 * unitWidth,
    },
});
