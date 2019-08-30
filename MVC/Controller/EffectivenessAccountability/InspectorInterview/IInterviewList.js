import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import PopSearchview from '../../../View/PopSearchview'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import JQFlatList from '../../../View/JQFlatList'

export default class IInterviewList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '督查约谈',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'新增'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.props.navigation.navigate('AddIInterview');
    };
    constructor(props){
        super (props);
        this.state = {
            data:[],
            nomore: false,
            pageSize: 0,
            pageNumber: 1,
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        //获取列表数据
        const ListNums = this._fullScreenJusting(54*unitWidth);
        this.setState({
            pageSize: ListNums,
        });
        this.onEndReachedCalled = false;
        this._getListData(ListNums, 1, true);
    }
    //满屏页面判断
    _fullScreenJusting = (itemHeight) => {
        const listNum = (812-64)*unitWidth / itemHeight;
        return Math.ceil(listNum);
    };
    _onEndReached = () => {
        RRCToast.show('加载');
        if (!this.state.nomore && this.onEndReachedCalled) {
            this._getListData(this.state.pageSize, ++this.state.pageNumber, false);
        }
        this.onEndReachedCalled = true;
    };
    _onRefresh = () => {
        RRCToast.show('刷新');
        this.setState({nomore: false, pageNumber: 1}, ()=>{
            this._getListData(this.state.pageSize, 1, true);
        })
    };
    _getListData = (ListNums, pageNumber, fresh) => {
        let nomore;
        HttpPost(URLS.QueryListByInterview,
            {
            }).then((response)=>{
                if (response.result === 1){
                    console.log(JSON.stringify(response));
                    const item = response.data.records;
                    item.length < ListNums ? nomore = true : nomore = false;
                    if (fresh){
                        this.setState({
                            data: item,
                            nomore: nomore,
                        })
                    } else {
                        this.setState({
                            data: this.state.data.concat(item),
                            nomore: nomore,
                        })
                    }
                }
        });
    };
    render(): React.ReactNode {
        return (
            <KeyboardAwareScrollView>
                <PopSearchview dataSource={[
                    {'name':'查询编号', 'type':2},
                    {'name':'事项来源', 'type':3, 'dataSource': ['内部转办', '领导交办', '临时交办']},
                    {'name':'约谈对象', 'type':2},
                    {'name':'约谈事项', 'type':2},
                    {'name':'状态查询', 'type':3, 'dataSource': ['待约谈','发布待审核','待发布','已保存','已发布','已撤回']},
                    {'name':'发布时间', 'type':1},
                    {'name':'提交时间', 'type':1},
                    {'name':'约谈完成时间', 'type':1},
                ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(c)=>{}}
                />
                <JQFlatList
                    data={this.state.data}
                    keyExtractor={(item , index)=> index.toString()}
                    renderItem={this._renderItemAction.bind(this)}
                    onEndReached={this._onEndReached}
                    onRefresh={({item}) => {this._onRefresh()}}
                    nomore={this.state.nomore}
                    ItemSeparatorComponent={()=> <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
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
            </KeyboardAwareScrollView>
        )
    }
    _renderItemAction = (item) =>{
        return (
            <TouchableOpacity activeOpacity={.5} onPress={()=>{this._clickCellAction(item)}}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{'22'}</Text>
                        <Text>{'33'}</Text>
                    </View>
                    <View style={styles.itemRightStyle}>
                        <Text style={{textAlign: 'right'}}>{'44'}</Text>
                        <Text>{'55'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) =>{

    }
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        height: 812 * unitHeight / 10,
        justifyContent: 'space-between',
    },
    itemLeftStyle:{
        justifyContent: 'space-between',
        width: 270 * unitWidth,
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
