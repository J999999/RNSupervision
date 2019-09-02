import React from 'react';
import {View, TouchableOpacity, Text, Image} from 'react-native';
import PropTypes from 'prop-types';
import {unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import NavigationService from '../Tools/NavigationService'
export default class JQJumpTo extends React.Component{
    static propTypes = {
        leftTitle: PropTypes.string.isRequired,
        dataSource: PropTypes.array.isRequired,
        postKeyName: PropTypes.string.isRequired,
        callBack:PropTypes.func,
    };
    constructor (props){
        super (props);
        this.state = {
            rightText: '请点击选择',
            data: {},
        }
    }
    render(): React.ReactNode {
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10*unitWidth,
                borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth,
                justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 54*unitWidth}}>
                    <Text>
                        {this.props.leftTitle+':'}
                    </Text>
                    <TouchableOpacity activeOpacity={.5}
                                      onPress={()=> this._jumpAction()}>
                        <View style={{justifyContent: 'center', height: 54*unitWidth,
                            marginLeft: 5*unitWidth, width: 260*unitWidth}}>
                            <Text>
                                {this.state.rightText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Image source={require('../Images/goRight.png')}
                       style={{width: 10*unitWidth, height: 10*unitWidth, marginRight: 10*unitWidth}}/>
            </View>
        )
    }
    _jumpAction(){
        NavigationService.navigate('CheckList',
            {
                'dataSource':this.props.dataSource,
                'refresh':(item) => {
                    let ids = '';
                    let names = '';
                    item.map((i)=>{
                        if (i.select){
                            names = names + i.name + ',';
                            ids = ids + i.id + ',';
                            this.setState({rightText: names});
                        }
                    });

                    let xx = this.state.data;
                    xx['title'] = this.props.leftTitle;
                    xx[this.props.postKeyName] = ids;
                    xx['name'] = names;
                    this.setState({data: xx}, ()=>{
                        this.props.callBack(this.state.data);
                    })
                }});
    }
}
