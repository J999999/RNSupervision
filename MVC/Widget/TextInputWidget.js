/**
 *
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    PixelRatio,
    Dimensions
}from 'react-native';

var screenWidth = Dimensions.get('window').width;

class TextInputWidget extends Component{

    constructor(props) {
        super(props);
     }

    _renderRow() {
        return (
            <View style={styles.rowContainer}  >
                <View style={styles.row}>
                    <Text
                        numberOfLines={1}
                        style={styles.textInputTitle} >
                        {this.props.title}
                    </Text>
                    <View style={styles.textInputEdit}>
                        <TextInput numberOfLines={1}  style = {styles.textInput}
                                underlineColorAndroid='transparent'
                                placeholder = { this.props.placeholder }
                                onChangeText={this.props.onChangeText}
                                   defaultValue={this.props.defaultValue}
                                   value = {this.props.value}
                      />
                    </View>
                </View>
            </View>
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
        height: 55,
        alignItems: 'center',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    textInputTitle: {
        width: 80,
        fontSize: 15,
        color: '#333',
        marginLeft: 15,
    },

    textInputEdit:{
        flex:1,
    },

    textInput:{
        padding:0,
        textAlignVertical: "center",
    },

    rightArrow:{
        paddingLeft:10,
        marginRight: 15,
    }

});

module.exports = TextInputWidget
