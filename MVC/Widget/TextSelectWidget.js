/**
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    PixelRatio,
    Dimensions, TouchableWithoutFeedback, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {unitWidth} from '../Tools/ScreenAdaptation';

var screenWidth = Dimensions.get('window').width;

class TextSelectWidget extends Component{

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
                        {this.props.title}
                    </Text>
                    <Text numberOfLines={1}  style = {styles.textInputEdit}
                               defaultValue = { this.props.placeholder }
                               onfouce = 'false'
                    > {this.props.value}</Text>

                    <View style={styles.rightArrow}>
                        <Icon
                            name='angle-down'
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

module.exports = TextSelectWidget
