import React from 'react';
import {View, Text, Image} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';

import HomePage from '../Controller/HomePage'
//import MailList from '../Controller/MailList'
import Function from '../Controller/Function'
import Mine from '../Controller/Mine'
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";

const RootTabs = createMaterialTopTabNavigator({
    HomePage:{
        screen: HomePage,
        navigationOptions:{
            title:'首页',
            tabBarIcon:({tintColor, focused}) => (
                focused ?
                    <Image
                    source={require('../Images/main_home1.png')}
                    style={{width: 25*unitWidth, height: 25*unitWidth}}/> :
                    <Image
                    source={require('../Images/main-home0.png')}
                    style={{width: 25*unitWidth, height: 25*unitWidth}}/>
                    )
        }
    },
    // MailList:{
    //     screen: MailList,
    //     navigationOptions:{
    //         title:'通讯录',
    //         tabBarIcon:({tintColor, focused}) => (
    //             focused ?
    //                 <Image
    //                     source={require('../Images/main_contacts_1.png')}
    //                     style={{width: 25*unitWidth, height: 25*unitWidth}}/> :
    //                 <Image
    //                     source={require('../Images/main_contacts_0.png')}
    //                     style={{width: 25*unitWidth, height: 25*unitWidth}}/>
    //         )
    //     }
    // },
    Function:{
        screen: Function,
        navigationOptions:{
            title:'功能',
            tabBarIcon:({tintColor, focused}) => (
                focused ?
                    <Image
                        source={require('../Images/main_function1.png')}
                        style={{width: 25*unitWidth, height: 25*unitWidth}}/> :
                    <Image
                        source={require('../Images/main_function0.png')}
                        style={{width: 25*unitWidth, height: 25*unitWidth}}/>
            )
        }
    },
    Mine:{
        screen: Mine,
        navigationOptions:{
            title:'我的',
            tabBarIcon:({tintColor, focused}) => (
                focused ?
                    <Image
                        source={require('../Images/main_me1.png')}
                        style={{width: 25*unitWidth, height: 25*unitWidth}}/> :
                    <Image
                        source={require('../Images/main_me0.png')}
                        style={{width: 25*unitWidth, height: 25*unitWidth}}/>
            )
        }
    }
},{
    initialRouteName: 'HomePage',
    animationEnabled: false,
    lazy: true,
    tabBarPosition: 'bottom',
    backBehavior:"none",
    tabBarOptions:{
        activeTintColor:'#38ADFF',
        inactiveTintColor: '#646464',
        showIcon: true,
        tabStyle:{//定义tab bar中tab的样式
            backgroundColor:"transparent",
        },
        indicatorStyle:{//指示器的样式(下图中的红条)
            backgroundColor:"transparent",
        },
        labelStyle:{//控制tab label的样式

        },
        iconStyle:{//定义icon的样式
        },
        style:{//定义tab bar的样式
            backgroundColor:"transparent",
        }
    }
});
export default RootTabs;
