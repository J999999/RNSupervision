import React from 'react';
import {View, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {unitWidth} from "../Tools/ScreenAdaptation";
import {RRCToast} from "react-native-overlayer/src";

export default class JQSingleInput extends React.Component{
    static propTypes = {
        leftTitle: PropTypes.string.isRequired,
        postKeyName: PropTypes.string.isRequired,
        callBack: PropTypes.func,
    };

    constructor (props){
        super (props);
        this.state = {
            text:'',
            data: {},
        }
    }
    _done(event){
        let xx = this.state.data;
        xx['title'] = this.props.leftTitle;
        let keyName = this.props.postKeyName;
        xx[keyName] = event.nativeEvent.text;
        this.setState({data: xx}, ()=>{
            this.props.callBack(this.state.data);
        });
    }
    render(): React.ReactNode {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10*unitWidth,
                borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                <Text>{this.props.leftTitle+':'}</Text>
                <TextInput
                    value={this.state.text}
                    onChangeText={(text)=>{this.setState({text: text})}}
                    onEndEditing={this._done.bind(this)}
                    style={{marginLeft: 5*unitWidth, height: 54*unitWidth, width: 280*unitWidth}}
                    placeholder={'请输入'+this.props.leftTitle}/>
            </View>
        )
    }
}
