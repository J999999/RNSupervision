import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import {titleHeight, unitHeight, unitWidth} from '../Tools/ScreenAdaptation';
import {FILE_HOST} from '../Tools/InterfaceApi';

class AttachDetail extends Component {

    constructor(props){
        super(props);

    };

    static  navigationOptions = ({navigation}) =>({
        title: '图片详情',

    });

    render(){
        const { params } = this.props.navigation.state;
        let uriStr  = params.item.uri.indexOf('/upload/files/')==-1  ? params.item.uri : (FILE_HOST+ params.item.uri)
        return(
            <View style={styles.main}>
                <Image style={styles.image} source={ {uri : uriStr } }  />
            </View>
        )

    }
}

var styles = StyleSheet.create({

    main:{
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
    },

    image:{
        width:'100%',
        height:'100%',
    }

})

module.exports = AttachDetail
