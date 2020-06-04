import React from 'react';
import {View, FlatList, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";

export default class IMSystemRecording extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '系统记录',
    });
    constructor (){
        super ();
        this.state = {
            data: [],
        }
    }
    componentDidMount(): void {
        const {navigation} = this.props;
        let dataLogList = navigation.getParam('dataLogList');
        this.setState({
            data: dataLogList,
        })
    }
    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <FlatList renderItem={this._renderItem.bind(this)}
                          data={this.state.data}
                          keyExtractor={(item, index) => index.toString()}
                          ItemSeparatorComponent={()=> <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
                />
            </View>
        )
    }
    _renderItem = ({item}) => {
        return (
            <View style={styles.itemStyle}>
                <View style={styles.itemLeftStyle}>
                    <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.operateType}</Text>
                    <Text>{'创建人:'+item.creatorName}</Text>
                </View>
                <View style={styles.itemRightStyle}>
                    <Text style={{textAlign: 'right'}}>{''}</Text>
                    <Text>{item.createTime}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        height: 812 * unitHeight / 10,
        justifyContent: 'space-between',
    },
    itemLeftStyle:{
        justifyContent: 'space-between',
        marginTop: 10 * unitWidth,
        marginLeft: 10 * unitWidth,
        marginBottom: 10 * unitWidth,
    },
    itemRightStyle:{
        justifyContent: 'space-between',
        marginBottom: 10 * unitWidth,
        marginTop: 10 * unitWidth,
        marginRight: 10 * unitWidth,
    },
});
