import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";

export default class Mine extends React.Component {
    static navigationOptions = {
        title: '我的',
        headerLeft: null,
    };

    render() {
        return (
            <View style={styles.contain}>
                <View style={styles.topBac}>
                    <View style={{flexDirection: 'row', height: 150 * unitHeight, alignItems: 'center'}}>
                        <Image source={require('../Images/main_me0.png')}
                               style={{width: 60*unitWidth, height: 60*unitWidth, marginLeft: 20*unitWidth}}/>
                        <View style={{height: 60 * unitWidth, width: 240 * unitWidth, marginLeft: 20 * unitWidth}}>
                            <Text style={{fontSize: 14*unitWidth}}>miss jiu</Text>
                            <Text style={{marginTop: 10*unitHeight,fontSize: 14*unitWidth}}>新郑督查项目组</Text>
                        </View>
                    </View>
                    <Image source={require('../Images/goRight.png')}
                           style={{height: 10*unitWidth, width: 10*unitWidth, marginRight: 10*unitWidth}}/>
                </View>
                <View style={{flexDirection: 'row', backgroundColor: '#fff', marginTop: 10*unitHeight,
                    height: 64*unitHeight, justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 64*unitHeight}}>
                        <Image source={require('../Images/main_contacts_1.png')}
                               style={{width: 25*unitWidth, height: 25*unitWidth, marginLeft: 10*unitWidth}}/>
                        <Text style={{marginLeft: 15*unitWidth, fontSize: 16*unitWidth}}>系统设置</Text>
                    </View>
                    <Image source={require('../Images/goRight.png')}
                           style={{height: 10*unitWidth, width: 10*unitWidth, marginRight: 10*unitWidth}}/>
                </View>
                <View style={{height: unitHeight, backgroundColor: '#fff', width: 50*unitWidth}}/>
                <View style={{flexDirection: 'row', backgroundColor: '#fff', height: 64*unitHeight,
                    justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', height: 64*unitHeight}}>
                        <Image source={require('../Images/main_contacts_1.png')}
                               style={{width: 25*unitWidth, height: 25*unitWidth, marginLeft: 10*unitWidth}}/>
                        <Text style={{marginLeft: 15*unitWidth, fontSize: 16*unitWidth}}>关于我们</Text>
                    </View>
                    <Image source={require('../Images/goRight.png')}
                           style={{height: 10*unitWidth, width: 10*unitWidth, marginRight: 10*unitWidth}}/>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#F4F4F4',
    },
    topBac: {
        backgroundColor: '#fff',
        height: 150 * unitHeight,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
