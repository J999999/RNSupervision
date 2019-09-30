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
export default class ShowScoreList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '成绩展示',
    });

    constructor(props){
        super (props);
        this.state = {
            dataList: [],
            refreshState: 0,
            pageSize: 11,
            pageNo: 1,
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
        HttpPost(URLS.ShowScoreList,
            search).then((response)=>{
                console.log(response);
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
                    {'name':'表名称', 'type':2, 'postKeyName':'tableName'},
                    {'name':'编辑时间', 'type':1, 'postKeyName':'beginTime', 'postKeyNameEnd':'endTime'},
                ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(c)=>{this._searchAction(c)}}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.tableName}</Text>
                        <Text>{item.creatorName}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{''}</Text>
                        <Text>{item.createTime}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        this.props.navigation.navigate('ShowScoreDetail',{item})
    };
    _searchAction = (info) => {
        search = {};
        let searchArr = [];
        searchArr = searchArr.concat(info);
        searchArr.map((i)=>{
            if (i.startTime)
                search['beginTime'] = i.startTime;
            if (i.endTime)
                search['endTime'] = i.endTime;
            if (i.tableName)
                search['tableName'] = i.tableName;
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
