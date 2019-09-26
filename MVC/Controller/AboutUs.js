
import React, {Component} from 'react'
import {
    View,
    Text,
    Image,
} from 'react-native'
import {unitWidth} from '../Tools/ScreenAdaptation';

export default class AboutUs extends Component {
    static navigationOptions = {
        headerTitle: '关于我们',
    };
    render() {
        return <View style={{flex: 1}}>

            <View style={{flex: 1, alignSelf: 'stretch', alignItems: 'center'}}>
                <Image source={require("../Images/logo.png")}
                       resizeMode="contain"
                       style={{
                           height:  90*unitWidth ,
                           marginTop:  100*unitWidth
                       }}/>
            </View>
            <View style={{flexDirection: "row", justifyContent: "center"}}>
                <Text style={{fontSize:  16 , color:'00b9ff'}}>隐私声明</Text>
                <View style={{width:  50*unitWidth }}/>
                <Text style={{fontSize:  16 , color:'00b9ff'}}>致谢</Text>
            </View>
            <Text style={{
                fontSize: 15,
                color: "#999",
                marginBottom: 30*unitWidth,
                marginTop:10*unitWidth,
                alignSelf: 'center'
            }}>北京久其移动版权所有©1997-2020</Text>
        </View>
    }
}

