import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types'
import DataPicker from 'react-native-datepicker'
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitWidth} from "../Tools/ScreenAdaptation";

export default class JQDatePicker extends React.Component{
    static propTypes = {
        leftTitle: PropTypes.string.isRequired,
        postKeyName: PropTypes.string.isRequired,
        callBack: PropTypes.func,
    };
    constructor (props){
        super (props);
        this.state = {
            data: {},
            startTime: '',
            endTime: '',
        }
    }

    _done(type, datetime){

        type === 'start' ? this.setState({startTime: datetime}): this.setState({endTime: datetime});

        let keyStart = this.props.postKeyName + 'Start';
        let keyEnd = this.props.postKeyName + 'End';
        let xx = this.state.data;
        xx['title'] = this.props.leftTitle;
        type === 'start' ? xx[keyStart] = datetime : xx[keyEnd] = datetime;
        this.setState({data: xx}, ()=>{
            if (this.state.data[keyStart] && this.state.data[keyEnd]){
                this.props.callBack(this.state.data);
            }
        });

    }
    render(): React.ReactNode {
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 10*unitWidth,
                borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                <Text>{this.props.leftTitle+':'}</Text>
                <DataPicker style={{width: 120*unitWidth, marginLeft: 5*unitWidth}}
                            date={this.state.startTime}
                            mode="date"
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            showIcon={false}
                            onDateChange={this._done.bind(this, 'start')}
                            placeholder={'开始时间'}
                />
                <Text style={{marginLeft: 5*unitWidth}}>至</Text>
                <DataPicker style={{width: 120*unitWidth, marginLeft: 5*unitWidth}}
                            date={this.state.endTime}
                            mode="date"
                            format="YYYY-MM-DD"
                            confirmBtnText="确定"
                            cancelBtnText="取消"
                            showIcon={false}
                            onDateChange={this._done.bind(this, 'end')}
                            placeholder={'结束时间'}
                />
            </View>
        )
    }
}
