import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import {screenWidth, unitWidth} from "../../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";

export default class RecallOption extends React.Component{
    static navigationOptions = {
        title: '撤回详情',
    };
    constructor (){
        super ();
        this.state = {
            text: '',
        }
    }
    render(): React.ReactNode {
        return(
            <View style={{flex: 1}}>
                <TextInputMultWidget title='撤回原因:'
                                     placeholder='请输入撤回原因'
                                     onChangeText={(text)=>{this.setState({text: text})}}
                />
                <TouchableOpacity style={styles.button} onPress={this.uploadNoticeInfo}>
                    <Text style={styles.buttonText}>
                        {'撤回'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    uploadNoticeInfo=()=> {
        const {navigation} = this.props;
        let ids = navigation.getParam('ids');
        if (this.state.text === ''){
            RRCToast.show('请填写撤回原因后撤回');
            return;
        }
        HttpPost(URLS.RecallInfo, {id: ids, recallInfo: this.state.text}, '正在撤回...').then((response) =>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                navigation.goBack();
            }
        }).catch((error)=>{
            RRCAlert.alert('服务器内部错误')
        })
    };
}
const styles = StyleSheet.create({
    button:{
        margin: 10*unitWidth,
        alignItems:'flex-end',
        width:screenWidth-16*unitWidth,
    },

    buttonText:{
        fontSize:18*unitWidth,
        color:'#FFF',
        padding:12*unitWidth,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5*unitWidth,
    },
});
