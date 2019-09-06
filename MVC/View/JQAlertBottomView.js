import React, {Component} from "react";
import {StyleSheet, Text, TouchableOpacity, View,Image} from 'react-native';
import JQAlertBottom from "../Tools/JQAlertBottom";
import PropTypes from 'prop-types';
import {RRCToast} from "react-native-overlayer/src";
import {unitWidth} from "../Tools/ScreenAdaptation";

export default class JQAlertBottomView extends Component {

    static propTypes = {
        leftName: PropTypes.string.isRequired,
        dataSource: PropTypes.array.isRequired,
        enabledEdit: PropTypes.bool,
        key: PropTypes.string,
        value: PropTypes.string,
        alertTitle: PropTypes.string,
        callBack: PropTypes.func,

    };

    constructor(props) {
        super(props);
        this.state = {
            typeName: this.props.alertTitle,
            type: 0,
            showTypePop: false,
        }
    }

    _openTypeDialog() {
        if (this.props.enabledEdit === true){
            this.setState({showTypePop: !this.state.showTypePop})
        }
    }

    render() {

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth,
                justifyContent: 'space-between'}}>
                <JQAlertBottom entityList={this.props.dataSource} callback={(i) => {
                    this.props.callBack(this.props.dataSource[i]);
                    this.setState({
                        typeName: this.props.dataSource[i]['name'],
                        type: i,
                    })
                }} show={this.state.showTypePop} closeModal={(show) => {
                    this.setState({
                        showTypePop: show
                    })
                }}/>
                <View style={{flexDirection: 'row', alignItems: 'center', height: 54*unitWidth}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333'}}>
                        {this.props.leftName + ':'}
                    </Text>
                    <TouchableOpacity onPress={() => this._openTypeDialog()}>
                        <View style={{width: 260*unitWidth, height: 54*unitWidth, justifyContent: 'center',
                            marginLeft: 5*unitWidth}}>
                            <Text>{this.state.typeName ? this.state.typeName : this.props.alertTitle}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <Image source={require('../Images/goRight.png')}
                       style={{width: 10*unitWidth, height: 10*unitWidth, marginRight: 10*unitWidth}}/>
            </View>

        );

    }
}

const styles = StyleSheet.create({
    button: {
        margin: 3,
        backgroundColor: 'white',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cdcdcd'
    },
});
