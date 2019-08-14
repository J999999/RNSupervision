import React from 'react';
import {View, StyleSheet, Image, TextInput, Text, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from 'react-native';

import {width, unitWidth, unitHeight} from '../Tools/ScreenAdaptation';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';

export default class Login extends React.Component {

    constructor(){
        super();
        this.state = {
            userName: '',
            password: '',
            keyboardShown: false,
        };
        //隐藏键盘
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
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
                               style={{width: unitWidth * 50, height: unitWidth * 50}}/>
                        <TextInput style={styles.TInput}
                                   placeholder={'请输入用户名'}
                                   onChangeText={(text)=>{this.setState({userName:text})}}
                                   value={this.state.userName}
                                   keyboardType={'numeric'}
                                   maxLength={11}>
                        </TextInput>
                    </View>
                    <View style={styles.password}>
                        <Image source={require('../Images/password.png')}
                               resizeMode={'contain'}
                               style={{width: unitWidth * 50, height: unitWidth * 50}}/>
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
                            <Text style={{fontSize: unitWidth * 26, color: '#696969'}}>忘记密码?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
    loginAction = () => {
        HttpPost(URLS.Login,{
            'username': this.state.userName,
            'password': this.state.password,
            'imsi': '',
        }).then((response)=>{
            alert(JSON.stringify(response));
        }).catch((err)=>{
            alert(err);
        });
    };
    forgetAction = () => {

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
        width: unitWidth * 150,
        height: unitWidth * 150,
        top: unitHeight *200,
    },
    userName: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        top: unitHeight * 400,
        width: unitWidth * 500,
        height :unitHeight * 74,
        borderTopRightRadius: unitWidth * 10,
        borderTopLeftRadius: unitWidth * 10,
        borderBottomWidth: unitHeight,
        borderBottomColor:'#DCDCDC',
    },
    password: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        top: unitHeight * 400,
        width: unitWidth * 500,
        height :unitHeight * 74,
        borderBottomLeftRadius: unitWidth * 10,
        borderBottomRightRadius: unitWidth * 10,
    },
    loginBtn: {
        backgroundColor: '#38ADFF',
        alignItems: 'center',
        justifyContent: 'center',
        top: unitHeight * 444,
        width: unitWidth * 500,
        height :unitHeight * 88,
        borderRadius: unitWidth * 10,
    },
    loginText: {
        color: '#fff',
        fontSize: unitWidth * 35,
        fontWeight: 'bold',
    },
    forget:{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        top: unitHeight * 454,
        width: unitWidth * 500,
        height :unitHeight * 44,
    },
    TInput: {
        width: unitWidth * 400,
        height: unitHeight * 44,
        left: unitWidth * 10,
    },
});
