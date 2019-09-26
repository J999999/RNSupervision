import React from 'react';
import {Text, TouchableOpacity, View, SectionList, Image, Button, StyleSheet, Platform} from 'react-native';
import {screenWidth, unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import {HttpPost, HttpPostFile} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import TextInputWidget from "../../Widget/TextInputWidget";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextFileSelectWidget from "../../Widget/TextFileSelectWidget";
import ImagePicker from "react-native-image-picker";
import OpenFile from "react-native-doc-viewer";

export default class PAppraisalDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '填报详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'更多'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        const {navigation} = this.props;
        let status = navigation.getParam('item').status;
        let moreArr = [];
        moreArr.push({text:'系统记录', style:{color:'#38ADFF', fontWeight: 'bold'}});
        status === 4 || status === 5 || status === 6 ?
            moreArr.push({text:'审核信息', style:{color:'#38ADFF', fontWeight: 'bold'}}) : null;
        moreArr.push({text:'取消', style:{color:'#38ADFF', fontWeight: 'bold'}});
        RRCAlert.alert('请选择', '', moreArr, this._clickMoreAction.bind(this))
    };
    _clickMoreAction = (index) => {
        const {navigation} = this.props;
        let swId = navigation.getParam('item').swId;
        let status = navigation.getParam('item').status;
        switch (index) {
            case 0:
                navigation.navigate('PAppraisalViewLog', {swId: swId});
                break;
            case 1:
                status === 4 || status === 5 || status === 6 ?
                    navigation.navigate('PAppraisalApproval', {id: navigation.getParam('item').id}) : null;
                break;
            case 2:
                break;
        }
    };
    constructor (){
        super ();
        this.state = {
            responseData: {},
            data: [],
            enabledEdit : false,
            fileList: [],
            hasAttach:false,
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        const {navigation} = this.props;
        let id = navigation.getParam('item').id;
        let type = '';
        if (navigation.getParam('item').status === 1){
            type = 1;
            this.setState({enabledEdit : true});
        } else {
            type = 2;
        }
        HttpPost(
            URLS.ListDetailFillin, {id: id, type: type}, '正在查询...'
        ).then((response)=>{
            if (response.result === 1){
                let dataArr = [];
                for (let i=0; i<response.data.fillInVOS.length; i++){
                    let iDic = response.data.fillInVOS[i];
                    dataArr.push({
                        title: iDic,
                        data: iDic.scoreVOList,
                    });
                }
                this.setState({
                    responseData: response.data,
                    data: dataArr,
                    fileList: response.data.fileList,
                })
            } else {
                RRCToast.show(response.msg);
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })

    }

    render(): React.ReactNode {
        const {navigation} = this.props;
        let status = navigation.getParam('item').status;
        var fileButtons = [] ;
        for(let i in this.state.fileList){
            let nameStr = this.state.filesList[i].name ? this.state.filesList[i].name : this.state.filesList[i].fileName;
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.state.fileList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(this.state.fileList[i])
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        return (
            <View style={{flex: 1}}>
                <View style={{height: 64*unitWidth, width: '100%', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'row'}}>
                    <Text
                        numberOfLines={0}
                        style={{fontSize: 19*unitWidth, fontWeight: 'bold'}}
                    >
                        {this.state.responseData.swName + ' '}
                    </Text>
                    <Text
                        numberOfLines={0}
                        style={{fontSize: 19*unitWidth, fontWeight: 'bold'}}
                    >
                        {this.state.responseData.indicatorName}
                    </Text>
                </View>
                <SectionList
                    extraData={this.state}
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 20*unitWidth}}/>}
                />
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                {
                    status === 1 || status === 2 || status === 5 ?
                        <TextFileSelectWidget
                            fileName = '点 击 选 择 文 件 '
                            onPress={this.takePicture.bind(this)}
                        /> : null
                }
                {
                    status === 1 || status === 2 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._upLoadFiles.bind(this, 1)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'上报'}
                            </Text>
                        </TouchableOpacity> : null
                }
                {
                    status === 1 || status === 2 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._upLoadFiles.bind(this, 2)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'保存'}
                            </Text>
                        </TouchableOpacity> : null
                }
                {
                    status === 2 || status === 5 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._upLoadFiles.bind(this, 3)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'编辑'}
                            </Text>
                        </TouchableOpacity> : null
                }
            </View>
        )
    }
    _renderSectionHeader = (sectionItem) => {
        const {section} = sectionItem;
        return(
            <View style={{backgroundColor:'#F4F4F4', height: 30 * unitHeight, justifyContent: 'center', paddingLeft: 10 * unitWidth}}>
                <Text style={{fontSize: 17*unitWidth, fontWeight: 'bold'}}>{section.title.deptTypeName}</Text>
            </View>
        )
    };
    _renderItem = ({item}) => {
        return(
            <View style={{height: 44*unitWidth, justifyContent: 'center', paddingLeft: 20*unitWidth}}>
                <TextInputWidget
                    editable={this.state.enabledEdit}
                    value={item.score ? item.score.toString(): ''}
                    title={item.deptName}
                    placeholder='请输入分数'
                    onChangeText={(text)=> {
                        const newText = text.replace(/[^\d]+/, '');
                        if (newText < 0 || newText > 100) {
                            RRCToast.show('分值有误，请重新输入...');
                            item.score = '';
                        }else {
                            item.score = newText;
                        }
                        this.setState({
                            data: this.state.data,
                        })
                }}/>
            </View>
        )
    };
    //先上传附件
    _upLoadFiles = (type) => {
        var files = [];

        if(this.state.fileList &&  this.state.fileList.length>0){
            var formData = new FormData();
            for(let i  in this.state.fileList){
                let nameStr = this.state.fileList[i].name ? this.state.fileList[i].name : this.state.fileList[i].fileName;
                let urlStr = this.state.fileList[i].url ? this.state.fileList[i].url : this.state.fileList[i].uri;
                let file = {uri:urlStr,type:'multipart/form-data',name:nameStr};
                formData.append('files',file);
            }
            HttpPostFile(URLS.FileUploads,formData,"正在上传文件..").then((response)=>{
                if(response.result === 1){
                    files = response.data;
                    switch (type) {
                        case 1:
                            this._onClickUpLoad(files);
                            break;
                        case 2:
                            this._onClickSave(files);
                            break;
                        case 3:
                            this._onClickEdit(files);
                            break;
                    }
                }else{
                    RRCToast.show(response.msg);
                }

            }).catch((error)=>{
                RRCAlert.alert('服务器内部错误')
            });
        }else{
            switch (type) {
                case 1:
                    this._onClickUpLoad([]);
                    break;
                case 2:
                    this._onClickSave([]);
                    break;
                case 3:
                    this._onClickEdit([]);
                    break;
            }
        }
    };
    //上报
    _onClickUpLoad = (files) => {
        const {navigation} = this.props;
        let modal = navigation.getParam('item');
        let requestData = {};
        requestData['fileList'] = files;
        requestData['id'] = modal.id;
        requestData['swId'] = modal.swId;
        requestData['ifReport'] = 1;
        requestData['indicatorId'] = modal.indicatorId;
        requestData['type'] = modal.status === 1 ? 1 : 2;
        let fillInVOS = [];
        for (let i=0; i< this.state.data.length; i++){
            fillInVOS.push(this.state.data[i].title);
        }
        requestData['fillInVOS'] = fillInVOS;

        HttpPost(URLS.SaveFillin, requestData, '正在上报...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    };
    //保存
    _onClickSave = (files) => {
        const {navigation} = this.props;
        let modal = navigation.getParam('item');
        let requestData = {};
        requestData['fileList'] = files;
        requestData['id'] = modal.id;
        requestData['swId'] = modal.swId;
        requestData['ifReport'] = 0;
        requestData['indicatorId'] = modal.indicatorId;
        requestData['type'] = modal.status === 1 ? 1 : 2;
        let fillInVOS = [];
        for (let i=0; i< this.state.data.length; i++){
            fillInVOS.push(this.state.data[i].title);
        }
        requestData['fillInVOS'] = fillInVOS;

        HttpPost(URLS.SaveFillin, requestData, '正在保存...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                this.props.navigation.state.params.callback();
                this.props.navigation.goBack();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    };
    //编辑
    _onClickEdit = () => {
        this.setState({enabledEdit: true})
    };

    //附件相关
    takePicture = async function() {

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                for(let i in this.state.fileList){
                    if(this.state.fileList[i].uri === response.uri){
                        RRCToast.show('不能重复添加');
                        return;
                    }
                }
                let tempArr = [];
                tempArr = tempArr.concat(this.state.fileList);
                let index = response.uri.indexOf('/images/') + 8;
                response['fileName'] = response.uri.substr(index, response.uri.length - index);
                tempArr.push(response);

                this.setState({
                    fileList: tempArr,
                    hasAttach:true,
                });
            }
        });
    };
    _pressDelAttach = (item)=>{
        let has = false;
        for(let i in this.state.fileList){
            if(this.state.fileList[i] === item){
                this.state.fileList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.state.fileList.length>0){
                this.setState({
                    hasAttach:true
                });
            }else{
                this.setState({
                    hasAttach:false,
                });
            }
        }
    };
    _pressDetail = (attachItem)=> {
        if (Platform.OS === 'ios') {
            let attUrl = attachItem.url ? 'http://221.13.156.198:10008' + attachItem.url : attachItem.uri;
            OpenFile.openDoc([{
                url: attUrl,
                fileNameOptional: '附件'
            }], (error, url)=>{

            })
        }else {
            let attUrl = attachItem.url ? 'http://221.13.156.198:10008' + attachItem.url : 'file://' + attachItem.uri;
            let uriSuffix = attUrl.substr(attUrl.lastIndexOf(".")+1).toLowerCase();
            OpenFile.openDoc([{
                url: attUrl,
                fileName: '附件',
                fileType: uriSuffix,
                cache: true,
            }], (error, uri)=>{
            })
        }
    };
}

const styles = StyleSheet.create({
    attach:{
        width:screenWidth,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'center',
        // justifyContent:'space-between',
        borderBottomWidth: unitWidth,
        borderColor:'#F4F4F4',//需要标色
    },
    attachText:{
        flex:1,
        marginLeft:10,
        marginTop:15,
        marginBottom:15,
        fontSize: 15,
        color: '#333',
    },

    rightIcon:{
        margin: 10,
    },

    delete:{
        width:30,
        height:29,
    },
});
