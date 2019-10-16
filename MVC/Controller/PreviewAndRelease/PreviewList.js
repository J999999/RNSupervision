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
export default class PreviewList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '成绩预览',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>
                { navigation.getParam('isInSelect') ? '完成' : '批量' }
            </Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.setState({
            isChecks: !this.state.isChecks,
        }, ()=>{
            this.props.navigation.setParams({ isInSelect: this.state.isChecks });
            if (this.state.isChecks) {
                RRCAlert.alert('请选择', '', [
                    {text:'批量发布', style:{color:'#38ADFF', fontWeight: 'bold'}},
                    {text:'批量撤回', style:{color:'#38ADFF', fontWeight: 'bold'}},
                    {text:'取消', style:{color:'#38ADFF', fontWeight: 'bold'}},
                ], (index)=>{
                    switch (index) {
                        case 0://发布
                            this.setState({
                                isRelease: true,
                            });
                            break;
                        case 1://撤回
                            this.setState({
                                isRelease: false,
                            });
                            break;
                        case 2://取消
                            this.setState({
                                isChecks: false,
                            }, ()=>{
                                this.props.navigation.setParams({ isInSelect: this.state.isChecks });
                            });
                            break;
                    }
                });
            } else {
                if (this.state.isRelease){
                    HttpPost(URLS.ReleasePublish, {swIds: this.state.ids}, '正在发布...').then((response)=>{
                        RRCToast.show(response.msg);
                        if (response.result === 1) {
                            this._onHeaderRefresh();
                        }
                    }).catch((err)=>{
                        RRCAlert.alert('服务器内部错误')
                    });
                } else {
                    HttpPost(URLS.BackPublish, {swIds: this.state.ids}, '正在撤回...').then((response)=>{
                        RRCToast.show(response.msg);
                        if (response.result === 1) {
                            this._onHeaderRefresh();
                        }
                    }).catch((err)=>{
                        RRCAlert.alert('服务器内部错误')
                    });
                }
            }
        });
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
            ids: [],                   //多选时，存储id，用来上报或驳回
            isRelease: false,
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
        HttpPost(URLS.QueryListPublish,
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
                        <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
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
                    {'name':'表名称', 'type':2, 'postKeyName':'tableName'},
                    {'name':'编辑时间', 'type':1, 'postKeyName':'beginTime', 'postKeyNameEnd':'endTime'},
                    {'name':'状态查询', 'type':3, 'postKeyName':'state', 'dataSource':
                            [
                                {'name': '未发布', 'id': 0},
                                {'name': '已发布', 'id': 1},
                                {'name': '已撤回', 'id': 2},
                                {'name': '填报完成', 'id': 3},
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
        switch (item.publishState) {
            case 0:
                recordState = '未发布';
                break;
            case 1:
                recordState = '已发布';
                break;
            case 2:
                recordState = '已撤回';
                break;
            case 3:
                recordState = '填报完成';
                break;
        }
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text numberOfLines={0}
                            style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.swName}</Text>
                        <Text>{item.publishName}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{recordState}</Text>
                        <Text>{item.createTime}</Text>
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
        if (this.state.isChecks === false){
            this.props.navigation.navigate('PreviewDetail', {item, callback: function () {
                    _that._onHeaderRefresh();
                }});
        } else {
            let arr = [];
            let idsArr = [];
            arr = arr.concat(this.state.dataList);
            idsArr = idsArr.concat(this.state.ids);
            arr.map((i)=>{
                if (i.id === item.id){
                    i.select = !item.select;
                    i.select === true ? idsArr.push(i.swId) : idsArr.splice(idsArr.indexOf(i.swId), 1);
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
                search['beginTime'] = i.startTime;
            if (i.endTime)
                search['endTime'] = i.endTime;
            if (i.swName)
                search['swName'] = i.swName;
            if (i.state)
                search['state'] = i.state;
            if (i.tableName)
                search['tableName'] = i.tableName;
        });
        this._onHeaderRefresh();
    };
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemLeftStyle:{
        justifyContent: 'space-between',
        marginTop: 10 * unitWidth,
        marginLeft: 10 * unitWidth,
        marginBottom: 10 * unitWidth,
        width: '60%'
    },
    itemRightStyle:{
        justifyContent: 'space-between',
        marginBottom: 10 * unitWidth,
        marginTop: 10 * unitWidth,
        marginRight: 10 * unitWidth,
    },
});
