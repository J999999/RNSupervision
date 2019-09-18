import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import {screenWidth, unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../Tools/JQFetch";
import URLS from "../Tools/InterfaceApi";

export default class OpinionWithContent extends React.Component{
    static navigationOptions = {
        title: '审核内容',
    };
    constructor (){
        super ();
        this.state = {
            text: '',
        }
    }
    componentDidMount(): void {
        const {navigation} = this.props;
        let ids = navigation.getParam('ids');
    }

    render(): React.ReactNode {
        return(
            <View style={{flex: 1}}>
                <TextInputMultWidget title='驳回意见:'
                                     placeholder='请输入驳回意见'
                                     onChangeText={(text)=>{this.setState({text: text})}}
                />
                <TouchableOpacity style={styles.button} onPress={()=>this.approval()} >
                    <Text style={styles.buttonText}>
                        {'驳回'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    approval=()=> {
        const {navigation} = this.props;
        let ids = navigation.getParam('ids');

        if (this.state.text === ''){
            RRCToast.show('请填写审批意见后驳回');
            return;
        }
        HttpPost(URLS.ProjectApprovalReject, {projectIdList: ids, opinion: this.state.text}, '正在提交...').then((response) =>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                navigation.state.params.callback()
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
