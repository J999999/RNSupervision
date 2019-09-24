import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TextInputMultWidget from "../../Widget/TextInputMultWidget";
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";

export default class ApprovalWorkOptions extends React.Component{
    static navigationOptions = {
        title: '请审核',
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
                <TextInputMultWidget title='审核意见:'
                                     placeholder='请输入审核意见'
                                     onChangeText={(text)=>{this.setState({text: text})}}
                />
                <TouchableOpacity style={styles.button} onPress={()=>this.uploadNoticeInfo(1)} >
                    <Text style={styles.buttonText}>
                        {'通过'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.uploadNoticeInfo(2)} >
                    <Text style={styles.buttonText}>
                        {'驳回'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    uploadNoticeInfo=(type)=> {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let approveType = navigation.getParam('approveType');
        let approveJsonArray = [];
        approveJsonArray.push({id: id, approveType: approveType, result: 2, suggestion: this.state.text});
        if (type === 1){
            //同意
            HttpPost(URLS.ApproveBatch, {approveJsonArray: approveJsonArray}, '正在提交...').then((response) =>{
                RRCToast.show(response.msg);
                if (response.result === 1){
                    navigation.goBack();
                }
            }).catch((error)=>{
                RRCAlert.alert('服务器内部错误')
            })
        } else if (type === 2){
            //驳回
            if (this.state.text === ''){
                RRCToast.show('请填写审核意见后驳回');
                return;
            }

            HttpPost(URLS.ApproveBatch,
                {
                    approveJsonArray:[{
                        id: id,
                        approveType: approveType,
                        result: 99,
                        suggestion: this.state.text
                    }]}, '正在提交...').then((response) =>{
                RRCToast.show(response.msg);
                if (response.result === 1){
                    navigation.goBack();
                }
            }).catch((error)=>{
                RRCAlert.alert('服务器内部错误')
            })
        }
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
