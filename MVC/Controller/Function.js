/* eslint-disable */
import React from 'react';
import {View, Text, TouchableOpacity, Image, default as Toast} from 'react-native';
import ExpandableList from 'react-native-expandable-section-flatlist';
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
                this.setState({
                    data: functions,
                })
            }
        });
    }

    _renderRow = (rowItem, rowId, sectionId) => (
        <TouchableOpacity key={rowId}
                          onPress={() => {

                              let func = undefined
                              if(rowItem.id){
                                  func = FunctionEnum.actionMap[rowItem.id]
                              }

                              if(!func){
                                  Toast.show("功能未开发");
                                  return
                              }

                              let icon = undefined
                              if(rowItem.icon){
                                  icon = FunctionEnum.iconMap[rowItem.id]
                              }

                              if(!icon){
                                  icon = FunctionEnum.iconMap[FunctionEnum.defaultIcon]
                              }
                              console.log(func + '   '+icon)

                              this.props.navigation.navigate(func,{'internal':this.internal,'children':rowItem.children,'title':rowItem.name,'id':rowItem.id});

                          }}>
            <View>
                <View style={{height: 44*unitHeight, flexDirection:'row', alignItems: 'center',padding:4}}>
                    <Image source={
                        FunctionEnum.iconMap[rowItem.id]
                    }
                           style={{width: 30*unitWidth, height: 30*unitWidth, marginLeft: 60*unitWidth,padding:4}}/>
                    <Text style={{marginLeft: 15*unitWidth, fontSize: 16*unitWidth}}>{rowItem.name}</Text>
                </View>
                <View style={{height: unitHeight, marginLeft: 100*unitWidth, backgroundColor:'#F4F4F4'}}/>
            </View>
        </TouchableOpacity>
    );
    _renderSection = (section, sectionId)  => {

        let sec = this.state.data[sectionId]

        return (
            <View style={{height: 56*unitHeight, borderBottomWidth: unitHeight, flexDirection:'row',
                alignItems: 'center', borderBottomColor: '#F4F4F4', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center',padding:4}}>
                    <Image source={
                        FunctionEnum.iconMap[sec.id]?FunctionEnum.iconMap[sec.id] : FunctionEnum.iconMap[FunctionEnum.defaultIcon]
                    }
                           style={{width: 35*unitWidth, height: 35*unitWidth, marginLeft: 20*unitWidth}}/>
                    <Text style={{marginLeft: 15*unitWidth, fontSize: 17*unitWidth}}>{section}</Text>
                </View>
                <Image source={require('../Images/goRight.png')}
                       style={{width: 10*unitWidth, height: 10*unitWidth, marginRight: 10*unitWidth}}/>
            </View>
        );
    };
    render() {
        return (
            <View style={{flex: 1}}>
                <ExpandableList
                    dataSource={this.state.data}
                    ref={instance => this.ExpandableList = instance}
                    headerKey={'name'}
                    memberKey={'children'}
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0]}
                    rowNumberCloseMode={0}
                />
            </View>
        );
    }
}
