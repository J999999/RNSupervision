import React from 'react';
import {Text, TouchableOpacity, View, Platform} from 'react-native';
import JQFlatList, {RefreshState} from "../../View/JQFlatList";
import {HttpPost, HttpPostFile} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCLoading, RRCToast} from "react-native-overlayer/src";
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import RNFetchBlob from 'rn-fetch-blob'
import OpenFile from 'react-native-doc-viewer'
import RNFileSelector from '../../View/RNFileSelector'
import ImagePicker from 'react-native-image-crop-picker'
import {FileDir, UploadFileDir} from '../../Tools/Utils';

var drop = false;
export default class KDataCloudList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '科室云盘',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'局云盘'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.props.navigation.navigate('JDataCloudList');
    };
    constructor(props){
        super (props);
        this.state = {
            dataList: [],
            refreshState: 0,
            pageSize: 11,
            pageNo: 1,
        }
    }
    componentWillUnmount(): void {
        drop = false;
    }

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        drop = false;
        this._onHeaderRefresh();
    }
    _onHeaderRefresh = () => {
        this.setState({
            refreshState: RefreshState.HeaderRefreshing,
            pageSize: this.state.pageSize,
            pageNo: 1,
        }, ()=>{
            this._getListData(true);
        })
    };
    _onFooterRefresh = () => {
        if (drop){
            this.setState({
                refreshState: RefreshState.FooterRefreshing,
                pageSize: this.state.pageSize,
                pageNo: ++this.state.pageNo,
            }, ()=>{
                this._getListData(false);
            })
        }
        drop = true;
    };
    _getListData = (refresh) => {
        HttpPost(URLS.GetDataCloud,
            {
                deptId: 2,
                diskType: 2,
                pageSize: this.state.pageSize,
                pageNo: this.state.pageNo
            }).then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data.records;
                item.map((i)=>{
                    RNFetchBlob.fs.exists(
                        RNFetchBlob.fs.dirs.DocumentDir + '/' + i.fileDTO.name
                    ).then((ex)=>{
                        ex ? i['exists'] = true : i['exists'] = false
                    })
                });
                if (refresh){
                    this.setState({dataList: item, refreshState: RefreshState.Idle});
                } else {
                    if (item < 10){
                        this.setState({refreshState: RefreshState.NoMoreData})
                    } else {
                        this.setState({
                            dataList: this.state.dataList.concat(item),
                            refreshState: RefreshState.Idle,
                        })
                    }
                }
            }else {
                this.setState({refreshState: RefreshState.Failure});
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    };
    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <JQFlatList
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this._onHeaderRefresh}
                    onFooterRefresh={this._onFooterRefresh}
                    data={this.state.dataList}
                    renderItem={this._renderItemAction}
                    keyExtractor={(item, index) => index.toString()}
                    removeClippedSubviews={false}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 10*unitWidth}}/>}
                />
                <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                    width:screenWidth-16*unitWidth,}} onPress={this._onClickUpLoad.bind(this)}>

                    <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                        alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,
                    }}>
                        {'上传文件'}
                    </Text>

                </TouchableOpacity>
            </View>
        )
    }
    _renderItemAction = ({item}) => {
        return (
            <View style={{paddingLeft: 10*unitWidth, paddingRight: 10*unitWidth, paddingTop: 10*unitWidth}}>
                <Text
                    numberOfLines={0}
                    style={{fontSize: 16*unitWidth}}>{item.fileDTO.name}
                </Text>
                <View style={{
                    height: 30*unitWidth,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <Text style={{fontSize: 13*unitWidth}}>{item.creatorName}</Text>
                    <Text style={{fontSize: 13*unitWidth}}>{item.createTime}</Text>
                    {
                        item.exists === true ? <TouchableOpacity activeOpacity={.5} onPress={this._onClickLook.bind(this, item)}>
                            <Text style={{color:'#38ADFF', fontWeight: 'bold', fontSize: 15*unitWidth}}>
                                查看
                            </Text>
                        </TouchableOpacity> : <TouchableOpacity activeOpacity={.5} onPress={this._onClickDownLoad.bind(this, item)}>
                            <Text style={{color:'#38ADFF', fontWeight: 'bold', fontSize: 15*unitWidth}}>
                                下载
                            </Text>
                        </TouchableOpacity>
                    }
                    {
                        item.buttons? <TouchableOpacity activeOpacity={.5} onPress={this._onClickDelete.bind(this, item)}>
                            <Text style={{color:'#38ADFF', fontWeight: 'bold', fontSize: 15*unitWidth}}>
                                删除
                            </Text>
                        </TouchableOpacity> : null
                    }
                </View>
            </View>
        );
    };

    //上传
    _onClickUpLoad ()  {
        let alertArr = [];
        alertArr.push({text:'拍照', style:{color:'#38ADFF', fontWeight: 'bold'}});
        alertArr.push({text:'选择图片', style:{color:'#38ADFF', fontWeight: 'bold'}});
        alertArr.push({text:'选择文件', style:{color:'#38ADFF', fontWeight: 'bold'}});
        alertArr.push({text:'取消', style:{color:'#38ADFF', fontWeight: 'bold'}});

        RRCAlert.alert('请选择', '', alertArr, (index)=>{
            switch (index) {
                case 0:
                    ImagePicker.openCamera({
                        width: 300,
                        height: 400,
                        cropping: true,
                    }).then(image => {
                        let imageArr = [];
                        imageArr.push(image);
                        image && this._saveFiles(imageArr)
                    });
                    break;
                case 1:
                    ImagePicker.openPicker({
                        multiple: true,
                        maxFiles:3,
                        cropperChooseText:"确定",
                        cropperCancelText:"取消",
                    }).then(images => {
                        let imagesArr = [];
                        imagesArr = imagesArr.concat(images);
                        images && this._saveFiles(imagesArr)
                    });
                    break;
                case 2:

                    let filter;
                    if (Platform.OS === 'ios') {
                        filter = [];
                    } else if (Platform.OS === 'android') {
                        filter = ".*\\.*";
                    }
                    RNFileSelector.Show(
                        {
                            path: UploadFileDir,
                            filter: filter,
                            title: '选择文件',
                            closeMenu: true,
                            editable: true,
                            onDone: (path) => {
                                if (Platform.OS === 'android'){
                                    path = 'file://' + path;
                                }
                                if (Platform.OS === 'android'){
                                    let index = path.lastIndexOf("\/");
                                    let name = path.substring(index + 1, path.length);
                                    this._saveFiles([{path: path, name: name}]);
                                } else {
                                    this._saveFiles([path]);
                                }
                            },
                            onCancel: () => {
                                console.log('cancelled')
                            }
                        }
                    );
                    break;
            }
        })
    };
    _saveFiles = (image) => {
        let formData = new FormData();
        for (let i = 0; i < image.length; i++){
            let uri = image[i].path;
            let name = image[i].name;
            let file = {uri: uri, type: 'multipart/form-data', name:name};
            formData.append('files',file);
        }
        let filesList = [];
        HttpPostFile(URLS.FileUploads, formData, '正在上传文件').then((response) =>{
            if (response.result === 1){
                filesList = response.data;
                this._save(filesList);
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })
    };
    _save = (fileList) => {
        HttpPost(URLS.SaveDataCloud, {fileList: fileList, diskType: 2}, '正在上传').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this._onHeaderRefresh();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })
    };
    //下载
    _onClickDownLoad = (item) => {
        RRCLoading.setLoadingOptions({text: '正在下载...'});
        RRCLoading.show();
        let uriSuffix = item.fileDTO.url.substr(item.fileDTO.url.lastIndexOf(".")+1).toLowerCase();
        let urlStr = 'http://221.13.156.198:10008' + item.fileDTO.url;
        let dirs = RNFetchBlob.fs.dirs;

        RNFetchBlob.config({
            fileCache: true,
            appendExt: uriSuffix,
            path: dirs.DocumentDir + '/' + item.fileDTO.name,
        }).fetch(
            'GET', urlStr
        ).then((res)=>{
            RRCLoading.hide();
            if (res.respInfo.status === 200){
                RRCToast.show('下载成功');
                this._onHeaderRefresh();
            }
        })
    };
    //查看
    _onClickLook = (item) => {
        if (Platform.OS === 'ios') {
            OpenFile.openDoc([{
                url: RNFetchBlob.fs.dirs.DocumentDir + '/' + item.fileDTO.name,
                fileNameOptional: item.fileDTO.name
            }], (error, url)=>{

            })
        }else {
            let uriSuffix = item.fileDTO.url.substr(item.fileDTO.url.lastIndexOf(".")+1).toLowerCase();
            OpenFile.openDoc([{
                url: 'file://' + RNFetchBlob.fs.dirs.DocumentDir + '/' + item.fileDTO.name,
                fileName: item.fileDTO.name,
                fileType: uriSuffix,
                cache: true,
            }], (error, uri)=>{
            })
        }
    };
    //删除
    _onClickDelete = (item) => {
        HttpPost(URLS.DeleteDataCloud, {id: item.id}, '正在删除...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this._onHeaderRefresh();
            }
        }).catch((error)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }
}

