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

class TextInputMultWidget extends Component{

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
                        <TextInput
                            multiline = {true}
                            numberOfLines = {4}
                            style = {styles.textInput}
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
        alignItems: 'center',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    textInputTitle: {
        width: 80,
        fontSize: 15,
        color: '#333',
        marginLeft: 15,
        marginTop:15,
        alignSelf:'flex-start'
    },

    textInputEdit:{
        flex:1,
    },

    textInput:{
        padding:5,
        height:120,
        textAlignVertical: "top",
        borderColor:'gray',
        borderRadius:2,
        borderWidth:0.5,
        textAlign:'left',
        marginTop:10,
        marginLeft:-5,
        marginBottom:10,
        marginRight:10,
    },

});

module.exports = TextInputMultWidget
