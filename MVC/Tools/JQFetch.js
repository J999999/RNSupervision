import React from 'react';
import {InteractionManager, AsyncStorage} from 'react-native';

//延时函数 30秒
const delay = (timeOut = 30*1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            reject(new Error('网络超时'));
        }, timeOut);
    })
};

//不带附件
const fetchPromise = (method, url, obj, msg) =>{
    let formData = new FormData();
    formData.append('clientType','1');
    for (let key in obj) {
        if (obj.hasOwnProperty(key)){
            let value = obj[key];
            formData.append(key, value);
        }
    }
    return new Promise((resolve, reject) => {
        fetch(url,{
            method: method,
            headers: {
                Accept: 'application/json',
                //'Content-Type': 'multipart/form-data',
                'Content-Type': 'application/json',
            },
            body: formData,
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
        })
    })
};

//带附件

//race任务
const _fetch = (fetchPromise, timeout) => {
    return Promise.race([fetchPromise, delay(timeout)]);
};
//post
const HttpPost = (url, formData,timeout = 30*1000)  =>{
    return _fetch(fetchPromise('POST', url, formData), timeout);
};

//get
const HttpGet = (url,timeout = 30*1000)  =>{
    return _fetch(fetchPromise('Get', url), timeout);
};

export {HttpPost ,HttpGet}
