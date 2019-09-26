import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";

export default class PreviewDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '成绩详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'系统记录'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        let id = this.props.navigation.getParam('item').id;
        this.props.navigation.navigate('PreviewLog', {id: id});
    };

    constructor () {
        super ();
        this.state = {
            data: {},
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        let id = this.props.navigation.getParam('item').id;
        HttpPost(URLS.PreviewScorePublish,{id: id}, '正在加载...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.setState({
                    data : response.data,
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('系统内部错误')
        })
    }
    render(): React.ReactNode {
        let data = this.state.data;
        let publishState = this.props.navigation.getParam('item').publishState;
        return (
            <View style={{flex: 1}}>
                <Text
                    numberOfLines={0}
                    style={{
                        fontSize: 19*unitWidth, fontWeight: 'bold', textAlign: 'center', width: '100%',
                        marginTop: 10*unitWidth,
                    }}>
                    {data.tableName}
                </Text>
                {
                    publishState === 2 || publishState === 3 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._onRelease.bind(this)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'发布'}
                            </Text>
                        </TouchableOpacity> : null
                }
                {
                    publishState === 2 || publishState === 3 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._onSetup.bind(this)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'设置'}
                            </Text>
                        </TouchableOpacity> : null
                }
                {
                    publishState === 2 || publishState === 3 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._onScore.bind(this)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'单位加分项'}
                            </Text>
                        </TouchableOpacity> : null
                }
                {
                    publishState === 1 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._onBack.bind(this)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'撤回'}
                            </Text>
                        </TouchableOpacity> : null
                }
            </View>
        )
    }

    _onRelease = () => {
        let id = this.props.navigation.getParam('item').id;
        HttpPost(URLS.ReleasePublishOne, {id: id}, '正在发布...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            }
        }).catch((err)=>{
            RRCAlert.alert('系统内部错误')
        })

    };
    _onBack = () => {
        let id = this.props.navigation.getParam('item').id;
        HttpPost(URLS.BackPublishOne, {id: id}, '正在撤回...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })

    };
    _onSetup = () => {
        this.props.navigation.navigate('PreviewSetup', {item: this.props.navigation.getParam('item')});
    };
    _onScore = () => {
        this.props.navigation.navigate('PreviewDeptSetup', {item: this.props.navigation.getParam('item')});
    }
}
