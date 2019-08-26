import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
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
        let homeFuncArr = JSON.parse(HomePageArr);

        for (let j=0; j<homeFuncArr.length; j++){
            let homeFunc = homeFuncArr[j];
            for (let k=0; k<sectionsArr.length; k++){
                let allFunc = sectionsArr[k].data;
                for (let l=0; l<allFunc.length; l++){
                    if (homeFunc.id === allFunc.id){
                        allFunc[l]['isXianShi'] = true;
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
            <View style={{flex: 1}}>

                {this.state.sections.map((i) => {
                    return (
                        <View>
                            <View style={{backgroundColor: '#F4F4F4', height: 30*unitHeight, justifyContent: 'center'}}>
                                <Text style={{marginLeft: 10*unitWidth, fontSize: 17*unitWidth,
                                    fontWeight: 'bold'}}>{i.title}</Text>
                            </View>
                            <FlatList
                                extraData={this.state}
                                renderItem={({item})=>
                                    <TouchableOpacity activeOpacity={.5} onPress={()=>{this._itemOnPressAction(item)}}>
                                        <View style={{width: 375*unitWidth/3.6, margin: 10*unitWidth, height: 40*unitWidth, borderRadius: 3*unitWidth,
                                            justifyContent: 'center', alignItems: 'center',
                                            backgroundColor: item.isXianShi === true?'#38ADFF':'#F4F4F4'}}>
                                            <Text style={{fontSize: 14*unitWidth, color: '#fff'}}>{item.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                                data={i.data}
                                numColumns={3}
                            />
                        </View>
                    )
                })}
            </View>
        )
    }
    _itemOnPressAction(item){
        let sectionArr = [];
        sectionArr = sectionArr.concat(this.state.sections);
        for (let i=0; i<sectionArr.length; i++){
            for (let j=0; j<sectionArr[i].data.length; j++){
                let func = sectionArr[i]['data'][j];
                if (item.id === func.id){
                    if (func.isXianShi){
                        sectionArr[i]['data'][j].isXianShi = !sectionArr[i]['data'][j].isXianShi;
                    }else {
                        sectionArr[i]['data'][j]['isXianShi'] = true;
                    }
                }
            }
        }
        this.setState({
            sections: sectionArr,
        })

    }
   _ClickHeaderRightAction = () => {
        this.props.navigation.goBack();
   }
}
