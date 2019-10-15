
import OpenFile from 'react-native-doc-viewer';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import {FILE_HOST} from './InterfaceApi';
import {RRCLoading, RRCToast} from 'react-native-overlayer/src';

export const sum = arr => arr.reduce((acc, n) => acc + n, 0);
export const UploadFileDir =  Platform.OS === 'android'? RNFetchBlob.fs.dirs.SDCardDir: RNFetchBlob.fs.dirs.DocumentDir
export const FileDir =  Platform.OS === 'android'? RNFetchBlob.fs.dirs.SDCardApplicationDir: RNFetchBlob.fs.dirs.DocumentDir

//下载
export const onClickDownLoad = (item) => {

    let uriSuffix = item.url.substr(item.url.lastIndexOf(".")+1).toLowerCase();
    let urlStr = FILE_HOST + item.url;
    let dirs = RNFetchBlob.fs.dirs
    console.log(FileDir + '/' + item.name)
    return  RNFetchBlob.config({
        fileCache: true,
        appendExt: uriSuffix,
        path: FileDir + '/' + item.name,
    }).fetch(
        'GET', urlStr
    )


};
//查看
export const onClickLook = (item) => {
    if (Platform.OS === 'ios') {
        OpenFile.openDoc([{
            url: FileDir + '/' + item.name,
            fileNameOptional: item.name
        }], (error, url)=>{

        })
    }else {
        let uriSuffix = item.url.substr(item.url.lastIndexOf(".")+1).toLowerCase();
        OpenFile.openDoc([{
            url: 'file://' + FileDir + '/' + item.name,
            fileName: item.name,
            fileType: uriSuffix,
            cache: true,
        }], (error, uri)=>{
            alert(error+'   '+uri);
        })
    }
};


//详情通用下载查看
export const downOpenFile=(item)=>{
    RNFetchBlob.fs.exists(
        FileDir + '/' + item.name
    ).then((ex)=>{
        if(!ex){
            RRCLoading.setLoadingOptions({text: '正在下载...'});
            RRCLoading.show();
            let  result = onClickDownLoad(item)
            result.then((res)=>{
                RRCLoading.hide()
                if(res.respInfo.status === 404){
                    RRCToast.show('原文件已缺失');
                }
                if (res.respInfo.status === 200){
                    RRCToast.show('下载成功');
                    onClickLook(item)
                }
            })
        }else{
            onClickLook(item)
        }
    })
}

export const arrayToObj = (obj, ownedLeafNodesMap) => {
    return obj.reduce((acc, { key }) => {
        const leafNodes = ownedLeafNodesMap[key];
        if (leafNodes) {
            acc = Object.assign(acc, leafNodes.keysMap);
        } else {
            acc[key] = 2;
        }
        return acc;
    }, {});
}

export const getPredecessorsMap=(treeData, predecessors = [], predecessorsOfNodeMap = {}, ownedLeafNodesMap = {}, allNodesMap = {})  =>{
    treeData.forEach((node) => {
        const { key, children, label } = node;
        predecessorsOfNodeMap[key] = predecessors;
        allNodesMap[key] = { key, label, isLeaf: !children };

        if (children) {
            ownedLeafNodesMap[key] = { count: 0, keysMap: {}, keys: [] };
        } else {
            predecessors.forEach(({ key: k }) => {
                ownedLeafNodesMap[k].count++;
                ownedLeafNodesMap[k].keysMap[key] = 2;
                ownedLeafNodesMap[k].keys.push(key);
            });
        }

        children && getPredecessorsMap(
            children,
            predecessors.concat(node),
            predecessorsOfNodeMap,
            ownedLeafNodesMap,
            allNodesMap
        );
    });

    return { predecessorsOfNodeMap, ownedLeafNodesMap, allNodesMap };
}

export const traverseTree =(treeData, fn) => {
    treeData.map(node => {
        fn(node);
        node.children &&  traverseTree(node.children, fn);
    });
}

export const getExpandedMap = (nodeKeys, predecessorsOfNodeMap, expandedMap = {})  => {
    nodeKeys.forEach(k => {
        predecessorsOfNodeMap[k].forEach(({ key }) => {
            expandedMap[key] = true;
        });
    });

    return expandedMap;
}
