/**
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PixelRatio,
    Dimensions, TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
                        <Icon
                            name='angle-right'
                            size={30}
                        />
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
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

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