/**
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PixelRatio,
    Dimensions, TouchableWithoutFeedback, Image,
} from 'react-native';
import {unitWidth} from "../Tools/ScreenAdaptation";

var screenWidth = Dimensions.get('window').width;

class TextFileSelectWidget extends Component{

    constructor(props) {
        super(props);
    }

    _renderRow() {
        return (
            <TouchableWithoutFeedback style={styles.rowContainer}  onPress = {this.props.onPress}>
                <View style={styles.row}>
                    <Text
                        numberOfLines={1}
                        style={styles.textInputTitle} >
                        {this.props.fileName}
                    </Text>
                    <View style={styles.rightArrow}>
                        <Image source={require('../Images/goRight.png')}
                               style={{width: 10*unitWidth, height: 10*unitWidth }}/>
                    </View>
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
        borderBottomWidth: unitWidth ,
        borderColor: '#F4F4F4',//需要标色
    },
    textInputTitle: {
        flex:1,
        width: 80*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
        marginLeft: 15*unitWidth,
    },

    rightArrow:{
        marginLeft:10*unitWidth,
        marginRight: 10*unitWidth,
    }

});

module.exports = TextFileSelectWidget;
