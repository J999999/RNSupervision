import React from 'react';
import {View, StyleSheet, Image, TextInput, Text, TouchableOpacity, Keyboard,
    TouchableWithoutFeedback} from 'react-native';

import {width, unitWidth, unitHeight} from '../Tools/ScreenAdaptation';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import * as Keychain from 'react-native-keychain'
import {getGuid} from "../Tools/JQGuid";
import AsyncStorage from '@react-native-community/async-storage'

export default class Login extends React.Component {

    constructor(){
        super();
        this.state = {
            userName: 'cb',
            password: '123456',
            // userName: 'dcdb1',
            // password: '123456',
            keyboardShown: false,
            imsi: '',
        };
        //隐藏键盘
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
        this.load();
    }
    componentDidMount(): void {
        this.keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            this.keyboardDidShowHandler.bind(this)
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            this.keyboardDidHideHandler.bind(this)
        );
    }
    componentWillUnmount(): void {
        if (this.keyboardDidShowListener != null){
            this.keyboardDidShowListener.remove();
        }
        if (this.keyboardDidHideListener != null){
            this.keyboardDidHideListener.remove();
        }
    }

    //键盘弹出事件响应
    keyboardDidShowHandler(event) {
        this.setState({ KeyboardShown: true });
    }

    //键盘隐藏事件响应
    keyboardDidHideHandler(event) {
        this.setState({ KeyboardShown: false });
    }

    static navigationOptions = {
        header: null,
    };

    render(): React.ReactNode {
        return(
            <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
                <View style={styles.contain}>
                    <Image source={require('../Images/logo.png')}
                           style={styles.logo}/>
                    <View style={styles.userName}>
                        <Image source={require('../Images/userName.png')}
                               resizeMode={'contain'}
                               style={{width: unitWidth * 25, height: unitWidth * 25}}/>
                        <TextInput style={styles.TInput}
                                   placeholder={'请输入用户名'}
                                   onChangeText={(text)=>{this.setState({userName:text})}}
                                   value={this.state.userName}
                                   autoCapitalize="none"
                                   underlineColorAndroid="transparent"
                                   maxLength={11}>
                        </TextInput>
                    </View>
                    <View style={styles.password}>
                        <Image source={require('../Images/password.png')}
                               resizeMode={'contain'}
                               style={{width: unitWidth * 25, height: unitWidth * 25}}/>
                        <TextInput style={styles.TInput}
                                   placeholder={'请输入密码'}
                                   onChangeText={(text)=>{this.setState({password:text})}}
                                   value={this.state.password}
                                   secureTextEntry={true}>
                        </TextInput>
                    </View>
                    <TouchableOpacity style={styles.loginBtn} onPress={()=>{this.loginAction()}}>
                        <View>
                            <Text style={styles.loginText}>登录</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.forget}>
                        <TouchableOpacity onPress={()=>{this.forgetAction()}}>
                            <Text style={{fontSize: unitWidth * 13, color: '#696969'}}>忘记密码?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    //获取 imsi
    async load(){
        try {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                this.setState({imsi: credentials.username});
            } else {
                await Keychain.setGenericPassword(getGuid(), '111', {});
                const xx = await Keychain.getGenericPassword();
                this.setState({imsi: xx.userName});
            }
        } catch (err) {
            console.log('4 = ', err);
        }
    }
    loginAction () {
        console.log(this.state.imsi);
        //this.props.navigation.navigate('Home');

        if (!this.state.userName){
            RRCToast.show('请输入用户名');
            return
        }
        if (!this.state.password){
            RRCToast.show('请输入密码');
            return
        }
        if (!this.state.imsi) {
            RRCToast.show('获取imsi失败，请重试...');
            return
        }
        HttpPost(URLS.Login,{
            'username': this.state.userName,
            'password': this.state.password,
            'imsi': this.state.imsi,
        },'正在登录...',).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                AsyncStorage.setItem('token', response.data.token);
                this.props.navigation.navigate('Home');
            }else {
                this.props.navigation.popToTop();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        });
    };
    forgetAction = () => {
        //忘记密码
    };
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#DCECFC',
        alignItems: 'center',
    },
    logo: {
        width: unitWidth * 75,
        height: unitWidth * 75,
        top: unitHeight *100,
    },
    userName: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        top: unitHeight * 200,
        width: unitWidth * 250,
        height :unitHeight * 37,
        borderTopRightRadius: unitWidth * 5,
        borderTopLeftRadius: unitWidth * 5,
        borderBottomWidth: unitHeight,
        borderBottomColor:'#DCDCDC',
    },
    password: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        top: unitHeight * 200,
        width: unitWidth * 250,
        height :unitHeight * 37,
        borderBottomLeftRadius: unitWidth * 5,
        borderBottomRightRadius: unitWidth * 5,
    },
    loginBtn: {
        backgroundColor: '#38ADFF',
        alignItems: 'center',
        justifyContent: 'center',
        top: unitHeight * 222,
        width: unitWidth * 250,
        height :unitHeight * 44,
        borderRadius: unitWidth * 10,
    },
    loginText: {
        color: '#fff',
        fontSize: unitWidth * 17,
        fontWeight: 'bold',
    },
    forget:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        top: unitHeight * 227,
        width: unitWidth * 250,
        height :unitHeight * 22,
    },
    TInput: {
        paddingVertical: 0,
        width: unitWidth * 200,
        height: unitHeight * 22,
        left: unitWidth * 5,
    },
});
