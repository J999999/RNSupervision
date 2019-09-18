/**
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PixelRatio,
    Dimensions, TouchableWithoutFeedback,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {unitWidth} from '../Tools/ScreenAdaptation';

var screenWidth = Dimensions.get('window').width;

class TextDateSelectWidget extends Component{

    constructor(props) {
        super(props);
        this.state={
            selectDate:this.props.date
        }
    }

    _renderRow() {
        return (
            <TouchableWithoutFeedback style={styles.rowContainer}  onPress = {this.props.onPress}>
                <View style={styles.row}>
                    <Text
                        numberOfLines={1}
                        style={styles.textInputTitle} >
                        {this.props.title}
                    </Text>

                    <DatePicker
                        style={styles.textInputEdit}
                        date={this.state.selectDate}
                        mode="date"
                        showIcon={false}
                        placeholder="请选择时间"
                        format="YYYY-MM-DD"
                        minDate="2000-01-01"
                        maxDate="2060-01-01"
                        confirmBtnText="确认"
                        cancelBtnText="取消"
                        disabled={this.props.disabled}
                        customStyles={{
                            dateInput: {
                                marginRight: 10,
                                marginLeft: -4,
                                paddingLeft:4,
                                alignItems: 'flex-start',
                                borderColor: '#ffffff'
                            }
                        }}
                        onDateChange={(date) => {
                            date  += ' 00:00:00'
                            this.props.onDateChange(date)
                            this.setState({
                                selectDate:date
                            })
                        }}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    render() {
        return this._renderRow();
    }
}

const styles = StyleSheet.create({

    rowContainer: {
        backgroundColor: '#FFF',
        width:screenWidth,
    },
    row: {
        flexDirection: 'row',
        height: 55*unitWidth,
        alignItems: 'center',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    textInputTitle: {
        width: 80*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
        marginLeft: 15*unitWidth,
    },
    textInputEdit:{
        flex:1,
    },
    rightArrow:{
        marginLeft:10*unitWidth,
        marginRight: 10*unitWidth,
    }

});

module.exports = TextDateSelectWidget
