import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";

export default class AddFunction extends React.Component{
    static navigationOptions = ({navigation}) =>({
        title: '功能配置',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                       onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>确定</Text>
        </TouchableOpacity>)
    });

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
    }

    render(): React.ReactNode {
        return (
            <View>

            </View>
        )
    }
   _ClickHeaderRightAction = () => {
        this.props.navigation.goBack();
   }
}
