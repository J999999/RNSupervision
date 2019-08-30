import React from 'react';
import {View, Text, TextInput} from 'react-native';
import PropTypes from 'prop-types';
import {unitWidth} from "../Tools/ScreenAdaptation";
import {RRCToast} from "react-native-overlayer/src";

export default class JQSingleInput extends React.Component{
    static propTypes = {
        leftTitle: PropTypes.string.isRequired,
        callBack: PropTypes.func,
    };

    constructor (props){
        super (props);
        this.state = {
            text:'',
        }
    }
    _done(event){
        this.props.callBack({'title':this.props.leftTitle, 'data':event.nativeEvent.text});
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
