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
var navigation = null;
/**
 * 短信群发
 */
export default class GroupMessageList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '短信群发',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('GroupMessageAdd',{
                                                callback:function(){
                                                    context._onHeaderRefresh()
                                                }
                                            });
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>新增</Text>
        </TouchableOpacity>)
    });

    constructor(props){
        super (props);
        this.internal =  '' //是否内部角色 1=是 、0=否

        context = this
        navigation = this.props.navigation;

        this.filter = {}
        this.pageSize = 20,
        this.state = {
            dataList:[],
            pageNo:1,
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
            pageNo: 1,
        }, ()=>{
            this._getListData(true);
        })
    };
    _onFooterRefresh = () => {
        if (drop){
            this.setState({
                refreshState: RefreshState.FooterRefreshing,
                pageNo: ++this.state.pageNo,
            }, ()=>{
                this._getListData(false);
            })
        }
        drop = true;
    };
    _getListData = (refresh) => {
        this.filter['pageNo'] = this.state.pageNo;
        this.filter['pageSize'] = this.pageSize;

        HttpPost(URLS.QuerySmsList,
            this.filter).then((response)=>{
            // RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data.records;

                if (refresh){
                    this.setState({dataList: item, refreshState: RefreshState.Idle});
                } else {
                    if (item < this.pageSize){
                        this.setState({refreshState: RefreshState.NoMoreData})
                    } else {
                        this.setState({
                            dataList: this.state.dataList.concat(item),
                            refreshState: RefreshState.Idle,
                        })
                    }
                }
            }else {
                RRCToast.show(response.msg);
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
                    {'name':'接收人员', 'type':2, 'postKeyName':'receiverName'},
                    {'name':'状态', 'type':3, 'postKeyName':'state', 'dataSource':
                            [
                                {'name': '发送成功', 'id': 1},
                                {'name': '发送失败', 'id': 0},
                            ], 'multipeSelect':false
                    },
                    {'name':'查询时间', 'type':1, 'postKeyName':'queryStartTime' ,'postKeyNameEnd':'queryEndTime'}
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
                        <Text style={styles.rowTitle}>{ item.content }</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>接收人：{ item.receiverName }</Text>
                    </View>

                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>发布人：{item.creatorName	}</Text>
                        <Text style={styles.rowSmallTitle}>发布时间：{ item.createTime}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        )
    };

    _searchOpt=(queryData)=>{
        for(let i in queryData){
            let item = queryData[i]
            for(let j in item){
                if(j!=='title' && j!=='name'){
                    if(item[j] instanceof  Array){
                        this.filter[j] = item[j][0]
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
        this.props.navigation.navigate('GroupMessageDetail', {bean: item ,callback:function(){
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
});
