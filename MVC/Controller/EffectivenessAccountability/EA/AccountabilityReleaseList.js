import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import PopSearchview from '../../../View/PopSearchview'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import JQFlatList, {RefreshState} from '../../../View/JQFlatList'
import {unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";

var search = {}; //查询参数
var drop = false;

export default class AccountabilityReleaseList extends React.Component{
    static navigationOptions = {
        title: '问责查看'
    };
    constructor(props){
        super (props);
        this.state = {
            dataList: [],
            refreshState: 0,
            pageSize: 10,
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
        HttpPost(URLS.QueryReleaseAccountability,
            search).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data.records;
                if (refresh){
                    this.setState({dataList: item, refreshState: RefreshState.Idle});
                } else {
                    console.log(item);
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
                            <Image source={require('../../../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <PopSearchview dataSource={[
                    {'name':'问责事项', 'type':2, 'postKeyName':'matter'},
                    {'name':'发布时间', 'type':1, 'postKeyName':'releaseTimeStart', 'postKeyNameEnd':'releaseTimeEnd'},
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
            case 1:
                recordState = '待约谈';
                break;
            case 2:
                recordState = '已保存';
                break;
            case 3:
                recordState = '发布待审核';
                break;
            case 4:
                recordState = '审核中';
                break;
            case 5:
                recordState = '已发布';
                break;
            case 6:
                recordState = '已撤回';
                break;
            case 7:
                recordState = '驳回';
                break
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
                        <Text>{'问责对象:'+item.interviewName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        this.props.navigation.navigate('AccountabilityReleaseDetail', {id: item.id});
    };
    _searchAction = (info) => {
        search = {};
        let searchArr = [];
        searchArr = searchArr.concat(info);
        searchArr.map((i)=>{
            if (i.matter)
                search['matter'] = i.matter;
            if (i.releaseTimeStart)
                search['releaseTimeStart'] = i.releaseTimeStart;
            if (i.releaseTimeEnd)
                search['releaseTimeEnd'] = i.releaseTimeEnd;
        });
        this._onHeaderRefresh();
    };
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        height: (812-64) * unitWidth / 10,
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
