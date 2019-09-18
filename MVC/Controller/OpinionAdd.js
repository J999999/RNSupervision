import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import {screenWidth, unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../Tools/JQFetch";
import URLS from "../Tools/InterfaceApi";
import TextSelectWidget from '../Widget/TextSelectWidget';
import { RRCActionSheet } from 'react-native-overlayer'

export default class OpinionAdd extends React.Component{
    static navigationOptions = {
        title: '意见建议',
    };
    constructor (){
        super ();
        this.state = {
            text: '',
            externalVisibility:1,  // 是否外部可见，1-可见，0-不可见
        }
    }
    componentDidMount(): void {
        const {navigation} = this.props;
    }

    render(): React.ReactNode {
        return(
            <View style={{flex: 1}}>
                <TextInputMultWidget title='意见建议:'
                                     placeholder='请输入意见建议'
                                     onChangeText={(text)=>{this.setState({text: text})}}
                />

                <TextSelectWidget title='外部可见：' placehodler='请选择' value ={this.state.externalVisibility==1?"是":"否"}
                                  onPress={()=>{
                                      RRCActionSheet.action( ['是','否'], (index)=>{
                                          if(index == 0){
                                              this.setState({
                                                  externalVisibility:1
                                              })
                                          }
                                          if(index == 1){
                                              this.setState({
                                                  externalVisibility:0
                                              })
                                          }
                                      }, {text: '取消', style:{color: '#ffffff'}});

                                  }}/>

                <TouchableOpacity style={styles.button} onPress={()=>this.save()} >
                    <Text style={styles.buttonText}>
                        {'提交'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    save=()=> {
        const {navigation} = this.props;
        let id = navigation.getParam('id');

        if (this.state.text === ''){
            RRCToast.show('请填写意见建议');
            return;
        }

        let bean = {projectId:id,opinion:this.state.text}

        HttpPost(URLS.OpinionSave, {projectId:id,opinion:this.state.text,externalVisibility: this.state.externalVisibility}, '正在提交...').then((response) =>{
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
