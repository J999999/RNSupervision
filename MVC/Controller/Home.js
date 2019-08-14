import React from 'react';
import {View, Text} from 'react-native';

export default class Home extends React.Component {
    static navigationOptions = {
        title: '主页',
        headerLeft: null,
    };
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Home</Text>
            </View>
        );
    }
}
