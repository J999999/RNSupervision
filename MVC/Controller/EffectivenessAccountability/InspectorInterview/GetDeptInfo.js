import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {screenHeight, unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import JQFlatList from '../../../View/JQFlatList'

export default class AuditList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '请选择可视范围',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'完成'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.props.navigation.state.params.callback(this.state.ids);
        this.props.navigation.goBack();
    };
    constructor(props){
        super (props);
        this.state = {
            dataList:[],
            ids: [],                   //多选时，存储id，用来审核
        };
    }
    componentWillUnmount(): void {

    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        this._getListData();
    }

    _getListData = () => {
        HttpPost(URLS.GetInternalDept, {}).then((response)=>{

            RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data;
                if (item.length > 0) {
                    item.map((i)=>{
                        i['select'] = false;
                    })
                }
                this.setState({
                    dataList: item,
                })
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
                    data={this.state.dataList}
                    renderItem={this._renderItemAction}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
                />
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={{flexDirection: 'row', height: 54*unitHeight, justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize: 16*unitWidth, left: 10*unitWidth}}>{item.deptName}</Text>
                    {
                        item.select === true ?
                            <View style={{justifyContent: 'center'}}>
                                <Image source={require('../../../Images/select_right.png')}
                                       style={{height: 15*unitWidth, width: 15*unitWidth, marginRight: 10*unitWidth}}
                                />
                            </View> : null
                    }
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        let arr = [];
        let idsArr = [];
        arr = arr.concat(this.state.dataList);
        idsArr = idsArr.concat(this.state.ids);
        arr.map((i)=>{
            if (i.id === item.id){
                i.select = !item.select;
                i.select === true ? idsArr.push(i) : idsArr.splice(idsArr.indexOf(i), 1);
            }
        });
        this.setState({data: arr, ids: idsArr});
    };

}

