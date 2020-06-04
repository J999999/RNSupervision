import React from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";


export default class AddFunction extends React.Component{
    static navigationOptions = ({navigation}) =>({
        title: '功能配置',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                       onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'确定'}</Text>
        </TouchableOpacity>)
    });
    constructor (){
        super ();
        this.state = {
            sections:[],
            HomePageArr:[],
        }
    }

    async componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        let sectionsArr = [];
        const xx = await AsyncStorage.getItem('userMenu');
        let xxx = JSON.parse(xx);
        for (let i = 0; i < xxx.length; i++) {
            sectionsArr.push({
                title: xxx[i].name,
                data: xxx[i].children
            });
        }
        const HomePageArr = await AsyncStorage.getItem('homePageFunc');
        let homeFuncArr = [];
        homeFuncArr = homeFuncArr.concat(JSON.parse(HomePageArr));

        for (let j=0; j<sectionsArr.length; j++){
            let cellFuncs = sectionsArr[j].data;
            for (let k=0; k<cellFuncs.length; k++){
                if (cellFuncs[k].children.length === 0){
                    for (let l=0; l<homeFuncArr.length; l++){
                        if (cellFuncs[k].id === homeFuncArr[l].id){
                            cellFuncs[k]['isXianShi'] = true;
                        }
                    }
                }else {
                    for (let m = 0; m < cellFuncs[k].children.length; m++) {
                        for (let l=0; l<homeFuncArr.length; l++){
                            if (cellFuncs[k].children[m].id === homeFuncArr[l].id){
                                cellFuncs[k].children[m]['isXianShi'] = true;
                            }
                        }
                    }
                }
            }
        }

        this.setState({
            sections: sectionsArr, //列表数据（登录人全部功能）
            HomePageArr: homeFuncArr, //展示在首页的功能（增加，删除操作此数组）
        });
    }

    render(): React.ReactNode {
        return (
            <ScrollView style={{flex: 1}}>
                {this.state.sections.map((i) => {
                    return (
                        <View>
                            <View style={{backgroundColor: '#DCDCDC', height: 30*unitHeight, justifyContent: 'center'}}>
                                <Text style={{marginLeft: 10*unitWidth, fontSize: 17*unitWidth,
                                    fontWeight: 'bold'}}>{i.title}</Text>
                            </View>
                            <FlatList
                                scrollEnabled={false}
                                extraData={this.state}
                                renderItem={({item})=>
                                    {
                                        return (
                                            item.children.length === 0 ?
                                                <TouchableOpacity activeOpacity={.5} onPress={()=>{this._itemOnPressAction(item)}}>
                                                    <View style={{width: 375*unitWidth/3.6, margin: 10*unitWidth, height: 40*unitWidth, borderRadius: 3*unitWidth,
                                                        justifyContent: 'center', alignItems: 'center',
                                                        backgroundColor: item.isXianShi === true?'#38ADFF':'#F4F4F4'}}>
                                                        <Text style={{fontSize: 14*unitWidth, color: item.isXianShi === true?'#fff':'black'}}>{item.name}</Text>
                                                    </View>
                                                </TouchableOpacity> : null
                                        )
                                    }

                                }
                                data={i.data}
                                numColumns={3}
                            />
                            {
                                i.data.map((k)=>{
                                    return(
                                        k.children.length > 0 ?
                                            <View>
                                                <View style={{backgroundColor: '#F4F4F4', height: 25*unitHeight, alignItems: 'center',
                                                    justifyContent: 'center', marginLeft: 20*unitWidth, marginRight: 20*unitWidth}}>
                                                    <Text style={{fontSize: 15*unitWidth,
                                                        fontWeight: 'bold'}}>{k.name}</Text>
                                                </View>
                                                <FlatList
                                                    scrollEnabled={false}
                                                    extraData={this.state}
                                                    renderItem={({item})=>
                                                        <TouchableOpacity activeOpacity={.5} onPress={()=>{this._itemOnPressAction(item)}}>
                                                            <View style={{width: 375*unitWidth/3.6, margin: 10*unitWidth, height: 40*unitWidth, borderRadius: 3*unitWidth,
                                                                justifyContent: 'center', alignItems: 'center',
                                                                backgroundColor: item.isXianShi === true?'#38ADFF':'#F4F4F4'}}>
                                                                <Text style={{fontSize: 14*unitWidth, color: item.isXianShi === true?'#fff':'black'}}>{item.name}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    }
                                                    data={k.children}
                                                    numColumns={3}
                                                />
                                            </View> : null
                                    )
                                })
                            }
                        </View>
                    )
                })}
            </ScrollView>
        )
    }
    _addHomeFunc(item){
        let funArr = [];
        funArr = funArr.concat(this.state.HomePageArr);
        funArr.push(item);
        this.setState({
            HomePageArr: funArr,
        })
    }
    _deleteHomeFunc(item){
        let funcArr = this.state.HomePageArr;
        for (let i=0; i<funcArr.length; i++){
            if (funcArr[i].id === item.id){
                funcArr.splice(i,1);
            }
        }
        this.setState({
            HomePageArr: funcArr,
        })
    }
    _itemOnPressAction(item){
        if (item.isDefault === 1){
            return;
        }
        let sectionArr = [];
        sectionArr = sectionArr.concat(this.state.sections);
        for (let i=0; i<sectionArr.length; i++){
            for (let j=0; j<sectionArr[i].data.length; j++){
                let func = sectionArr[i]['data'][j];
                if (func.children.length === 0){
                    if (item.id === func.id){
                        if (func.isXianShi){
                            sectionArr[i]['data'][j].isXianShi = !sectionArr[i]['data'][j].isXianShi;
                            this._deleteHomeFunc(item);
                        }else {
                            sectionArr[i]['data'][j]['isXianShi'] = true;
                            this._addHomeFunc(item);
                        }
                    }
                }else {
                    for (let k=0; k<func.children.length; k++){
                        let funxx = func.children[k];
                        if (item.id === funxx.id){
                            if (funxx.isXianShi) {
                                sectionArr[i]['data'][j]['children'][k].isXianShi = !sectionArr[i]['data'][j]['children'][k].isXianShi;
                                this._deleteHomeFunc(item);
                            }else {
                                sectionArr[i]['data'][j]['children'][k]['isXianShi'] = true;
                                this._addHomeFunc(item);
                            }
                        }
                    }
                }
            }
        }
        this.setState({
            sections: sectionArr,
        })

    }
   _ClickHeaderRightAction = () => {
        AsyncStorage.setItem('homePageFunc', JSON.stringify(this.state.HomePageArr));
        this.props.navigation.state.params.refresh(this.state.HomePageArr);
        this.props.navigation.goBack();
   }
}
