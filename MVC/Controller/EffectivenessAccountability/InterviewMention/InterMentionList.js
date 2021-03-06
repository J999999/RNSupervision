import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, RefreshControl} from 'react-native';
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import PopSearchview from '../../../View/PopSearchview'
import JQFlatList, {RefreshState} from '../../../View/JQFlatList'

var search = {}; //查询参数
var drop = false;

export default class InterMentionList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '约谈提起',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'新增'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.props.navigation.navigate('InterMentionAdd');
    };
    constructor(props){
        super (props);
        this.state = {
            dataList:[],
            pageSize: 10,
            pageNo: 1,
            refreshState: 0,
        }
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
        search['queryType'] = '1'; //普通列表
        search['recordType'] = '1'; //约谈
        let states = this.props.navigation.getParam('states');
        if(states !== undefined){
            search['states'] = states ;
        }

        HttpPost(URLS.InterMentionListApi,
            search).then((response)=>{
            RRCToast.show(response.msg);
            console.log(response);
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
                            <Image source={require('../../../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <PopSearchview dataSource={[
                    {'name':'事项来源', 'type':2, 'postKeyName':'sourceStr'},
                    {'name':'约谈事项', 'type':2, 'postKeyName':'matter'},
                    {'name':'状态查询', 'type':3, 'postKeyName':'states', 'dataSource':
                            [
                                {'name': '待审核', 'id': '3'},
                                {'name': '审核中', 'id': '4'},
                                {'name': '审核通过', 'id': '5'},
                                {'name': '驳回', 'id': '6'},
                            ]
                    },
                    {'name':'提起时间', 'type':1, 'postKeyName':'approvalReportTimeStart', 'postKeyNameEnd':'approvalReportTimeEnd'},
                ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(c)=>{this._searchAction(c)}}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        let recordState = '';
        switch (item.recordState) {
            case 3:
                recordState = '待审核';
                break;
            case 4:
                recordState = '审核中';
                break;
            case 5:
                recordState = '审核通过';
                break;
            case 6:
                recordState = '驳回';
                break;
        }
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.sourceStr}</Text>
                        <Text>{'提交人:'+item.userName}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{recordState}</Text>
                        <Text>{'提交时间:'+item.approvalReportTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        this.props.navigation.navigate('InterMentionDetail', {id: item.id, buttons: item.buttons});
    };
    _searchAction = (info) => {
        search = {};
        let searchArr = [];
        searchArr = searchArr.concat(info);
        searchArr.map((i)=>{
            if (i.sourceStr)
                search['sourceStr'] = i.sourceStr;
            if (i.states)
                search['states'] = i.states;
            if (i.matter)
                search['matter'] = i.matter;
            if (i.approvalReportTimeStart)
                search['approvalReportTimeStart'] = i.approvalReportTimeStart;
            if (i.approvalReportTimeEnd)
                search['approvalReportTimeEnd'] = i.approvalReportTimeEnd;
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
