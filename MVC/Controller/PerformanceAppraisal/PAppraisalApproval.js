import React from 'react';
import {View, FlatList, Text} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";

export default class PAppraisalApproval extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '审核信息',
    });
    constructor (){
        super ();
        this.state = {
            data: [],
        }
    }
    componentDidMount(): void {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.ApprovalFillin,{id: id}, '正在查询...').then((response)=>{
            console.log(response);
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.setState({
                    data: response.data,
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
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
            <View style={{justifyContent: 'center', padding: 10*unitWidth}}>
                <Text numberOfLines={0}
                      style={{marginTop: 10*unitWidth}}>
                    {item.operateMsg}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10*unitWidth,
                    marginBottom: 5*unitWidth}}>
                    <Text>{item.operater}</Text>
                    <Text>{item.operateTime}</Text>
                    <Text>{item.operateType}</Text>
                </View>
            </View>
        )
    }
}
