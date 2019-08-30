import React from 'react';
import {InteractionManager} from 'react-native';
import {RRCAlert, RRCLoading, RRCToast} from 'react-native-overlayer';
import AsyncStorage from '@react-native-community/async-storage'


//延时函数 30秒
const delay = (timeOut = 30*1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('网络超时'));
        }, timeOut);
    })
};

//不带附件 get
async function fetchGET (url,obj,msg) {
    if (msg){
        const options = {text: msg};
        RRCLoading.setLoadingOptions(options);
        RRCLoading.show();
    }

    let getURL = url + '?clientType=1';

    const token = await AsyncStorage.getItem('token');
    return new Promise((resolve, reject) => {
        fetch(getURL,{
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
        }).then((response) => {
            console.log(response.json())
            if (response.ok) {
                return response.json();
            } else {
                reject(new Error('服务器异常'));
            }
        }).then((responseJson) => {
            resolve(responseJson);
        }).catch((err) => {
            reject(new Error(err));
        }).finally(()=>{
            RRCLoading.hide();
        })
    })
}

//不带附件
async function fetchPromise (url, obj, msg) {
    if (msg){
        const options = {text: msg};
        RRCLoading.setLoadingOptions(options);
        RRCLoading.show();
    }
    obj['clientType'] = 1;
console.log("requestJson::::  " +url + JSON.stringify(obj)  )
    const token = await AsyncStorage.getItem('token');
    return new Promise((resolve, reject) => {
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': token,
            },
             body: JSON.stringify(obj)  ,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                reject(new Error('服务器异常'));
            }
        }).then((responseJson) => {
            resolve(responseJson);
        }).catch((err) => {
            reject(new Error(err));
        }).finally(()=>{
            RRCLoading.hide();
        })
    })
}

//仅附件

async function fetchPromiseFile (url, files, msg) {
    if (msg){
        const options = {text: msg};
        RRCLoading.setLoadingOptions(options);
        RRCLoading.show();
    }
    obj['clientType'] = 1;
    const token = await AsyncStorage.getItem('token');
    return new Promise((resolve, reject) => {
        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data;charset=utf-8',
                'token': token,
            },
            body:  files ,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                reject(new Error('服务器异常'));
            }
        }).then((responseJson) => {
            resolve(responseJson);
        }).catch((err) => {
            reject(new Error(err));
        }).finally(()=>{
            RRCLoading.hide();
        })
    })
}

//race任务
const _fetch = (fetchPromise, timeout) => {
    return Promise.race([fetchPromise, delay(timeout)]);
};
const _fetchGet = (fetchGET, timeout) => {
    return Promise.race([fetchGET, delay(timeout)]);
};
//post
const HttpPost = (url, formData, msg, timeout = 30*1000)  =>{
    return _fetch(fetchPromise(url, formData, msg), timeout);
};

//get
const HttpGet = (url, formData, msg, timeout = 30*1000)  =>{
    return _fetchGet(fetchGET(url, formData, msg), timeout);
};

export {HttpPost ,HttpGet}
