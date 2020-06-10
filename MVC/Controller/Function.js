/* eslint-disable */
import React from 'react';
import {View, Text, TouchableOpacity, Image, FlatList, default as Toast} from 'react-native';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import AsyncStorage from '@react-native-community/async-storage'
import FunctionEnum from '../Tools/FunctionEnum';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';

export default class Function extends React.Component {

    constructor(){
        super();
        this.internal = ''//是否内部角色 1=是 、0=否
        this.roleLevel = '',
        this.state = {
            data:[],
        };
    }

    componentDidMount(): void {
        this.getFunctionMenu()
        this.getLoginInfo()
    }
    getLoginInfo(){
        HttpPost(URLS.LoginUser,{},'').then((response)=>{
            if (response.result == 1){
                this.internal = response.data.internal
                this.roleLevel = response.data.role.level
                AsyncStorage.setItem('internal', response.data.internal); //是否内部角色 1=是 、0=否
                AsyncStorage.setItem('roleLevel', response.data.role.level); //角色级别1，2，3，4，5
            }
        })
    }
    getFunctionMenu(){
        HttpPost(URLS.UserMenu, {'isDefault':0},'').then((response)=>{
            if (response.result !== 1) {
                RRCToast.show(response.msg);
            }else {
                let functions = []
                for (let i = 0; i < response.data.length; i++){
                    let func = response.data[i];
                    if (func.isDefault == 0){
                       functions.push(func);
                    }
                }
                for (let i=0; i<functions.length; i++) {
                    functions[i]['isSelect'] = false;
                    for (let j=0; j<functions[i].children.length; j++) {
                        if (functions[i].id === 1) {
                            functions[i].children[j]['level'] = 2;
                        }
                        functions[i].children[j]['isSelect'] = false;
                        for (let k=0; k<functions[i].children[j].children.length; k++) {
                            functions[i].children[j].children[k]['isSelect'] = false;
                            functions[i].children[j].children[k]['level'] = 3;
                        }
                    }
                }
                this.setState({
                    data: functions,
                })
            }
        });
    }
    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={this._renderItemAction.bind(this)}
                    ItemSeparatorComponent={this._itemSeparatorComponent.bind(this)}
                />
            </View>
        )
    }

    _renderItemAction({item, index}) {
        return (
            <TouchableOpacity onPress={()=>{this._clickItemAction(item)}}>
                <View style={{
                    flexDirection: 'row', height: 64*unitWidth, alignItems: 'center', padding: 10*unitWidth,
                    marginLeft: (item.level - 1) * 50 *unitWidth, justifyContent: 'space-between'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image source={
                            FunctionEnum.iconMap[item.id]
                        }
                               style={{width: 40*unitWidth, height: 40*unitWidth, marginLeft: 10*unitWidth}}/>
                        <Text style={{fontSize: 14*unitWidth, marginLeft: 20*unitWidth}}>{item.name}</Text>
                    </View>

                    {
                        item.children.length !== 0 ?
                            <Image source={require('../Images/goRight.png')}
                                                  style={{width: 10*unitWidth, height: 10*unitWidth, marginRight: 10*unitWidth}}/>:null
                    }
                </View>
            </TouchableOpacity>
        )
    }
    _itemSeparatorComponent = () => {
        return (
            <View style={{height: unitHeight, backgroundColor: '#DCDCDC'}}>

            </View>
        )
    };
    _clickItemAction(item) {
        if (item.children.length === 0) {
            console.log('this.internal = ', this.internal);
            console.log('this.roleLevel = ', this.roleLevel);
            if (this.internal === 0) {
                if (this.roleLevel === 3 || this.roleLevel === 4 || this.roleLevel === 5) {
                    if (item.id === 82) {
                        this.props.navigation.navigate('DetailedList');
                        return;
                    } else if (item.id === 83) {
                        this.props.navigation.navigate('PracticableList', {deptId: ''});
                        return;
                    }
                    if (item.id === 86 || item.id === 87 || item.id === 88 || item.id === 89 || item.id === 90 || item.id === 91 || item.id === 92 || item.id === 93 || item.id === 94) {
                        this.props.navigation.navigate('StatisticsCharts',{bean : item})
                    } else {
                        let func = FunctionEnum.actionMap[item.id];
                        this.props.navigation.navigate(func,{'internal':this.internal,'children':item.children,'title':item.name,'id':item.id});
                    }
                }else {
                    if (item.id === 86 || item.id === 87 || item.id === 88 || item.id === 89 || item.id === 90 || item.id === 91 || item.id === 92 || item.id === 93 || item.id === 94) {
                        this.props.navigation.navigate('StatisticsCharts',{bean : item})
                    } else {
                        let func = FunctionEnum.actionMap[item.id];
                        this.props.navigation.navigate(func,{'internal':this.internal,'children':item.children,'title':item.name,'id':item.id});
                    }
                }
            } else {
                if (item.id === 86 || item.id === 87 || item.id === 88 || item.id === 89 || item.id === 90 || item.id === 91 || item.id === 92 || item.id === 93 || item.id === 94) {
                    this.props.navigation.navigate('StatisticsCharts',{bean : item})
                } else {
                    let func = FunctionEnum.actionMap[item.id];
                    this.props.navigation.navigate(func,{'internal':this.internal,'children':item.children,'title':item.name,'id':item.id});
                }
            }
        }
        if (item.isSelect === false) {
            item.isSelect = true;
            let arr1 = [];
            let arr2 = [];
            arr1 = arr1.concat(this.state.data);
            arr2 = arr2.concat(item.children);
            let loc = arr1.indexOf(item) + 1;
            arr2.unshift(loc, 0);
            Array.prototype.splice.apply(arr1, arr2);
            this.setState({ data: arr1 })
        } else {
            item.isSelect = false;
            let arr1 = [];
            let arr2 = [];
            arr1 = arr1.concat(this.state.data);
            arr2 = arr2.concat(item.children);
            for (let i=0; i<arr1.length; i++) {
                for (let j=0; j<arr2.length; j++) {
                    if (arr1[i].id === arr2[j].id) {
                        arr1.splice(i, 1);
                    }
                }
            }
            this.setState({ data: arr1 })
        }
    }
}
