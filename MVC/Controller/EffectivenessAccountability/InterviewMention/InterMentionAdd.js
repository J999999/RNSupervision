import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Button, PixelRatio, TextInput} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../../../Widget/TextFileSelectWidget";
import JQAlertBottomView from '../../../View/JQAlertBottomView';
import DataPicker from 'react-native-datepicker'
import {RRCToast} from "react-native-overlayer/src";
import ImagePicker from "react-native-image-picker";
import {screenWidth, unitHeight, unitWidth} from "../../../Tools/ScreenAdaptation";
import {HttpPost, HttpPostFile} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RefreshState} from "../../../View/JQFlatList";

//附件弹出框选项
var options = {
    title: '选择文件',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'本地选择',
    cancelButtonTitle:'取消',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    }
};

var _that;

export default class InterMentionAdd extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '新增约谈提起',
    });
    constructor (props) {
        super(props);
        _that = this;
        this.state = {
            sourceStr: '', //来源描述
            matter: '', //事由描述
            situation: '', //主要情况
            filesList: [],              // 附件  非必填
            hasAttach:false,           // 附件相关，与上传数据无关
            interviewList: [{
                deptName:'',
                dutyName:'',
                interviewType: '2',
                staffName: '',
            }],     // 约谈对象list
            userName: '',              // 编辑人     文本输入框，必填。
            reportTimeStr: this._functiontimetrans(new Date()),         // 编辑时间    日期选择框，必填。

        };
    }
    componentDidMount(): void {
        HttpPost(URLS.LoginUser,{},'正在加载...').then((response)=>{
            if (response.result !== 1){
                RRCToast.show(response.msg);
            } else {
                this.setState({
                    userName: response.data.name,
                })
            }
        });
    }

    render(): React.ReactNode {
        var fileButtons = [] ;
        var ss = [];

        for(let i in this.state.filesList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.state.filesList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.state.filesList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(this.state.filesList[i])
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        }
        for (let j=0; j<this.state.interviewList.length; j++){
            var aa = (
                <View style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center', borderBottomWidth: unitWidth , borderColor: '#F4F4F4'}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333', marginLeft: 15*unitWidth}}>
                        {j === 0 ? '约谈对象:' : ''}
                    </Text>
                    <View style={{width: 245*unitWidth}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15*unitWidth, color: '#333'}}>单位:</Text>
                            <TextInput numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                       placeholder = {'请输入单位名称'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['deptName'] : text} : item)
                                       })}}/>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontSize: 15*unitWidth, color: '#333'}}>职务:</Text>
                            <TextInput numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                       placeholder = {'请输入职务名称'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['dutyName'] : text} : item)
                                       })}}/>
                            <Text style={{fontSize: 15*unitWidth, marginLeft: 10*unitWidth, color: '#333'}}>姓名:</Text>
                            <TextInput numberOfLines={1}
                                       underlineColorAndroid='transparent'
                                       placeholder = {'请输入姓名'}
                                       onChangeText={(text)=>{this.setState({
                                           interviewList: this.state.interviewList.map(
                                               (item, index)=>index === j ?
                                                   {...item, ['staffName'] : text} : item)
                                       })}}/>
                        </View>
                    </View>
                    {
                        j === 0 ?
                            <TouchableOpacity onPress={()=>{this._addInterview()}}>
                                <Image style={{marginRight: 10*unitWidth, width:25*unitWidth, height:25*unitWidth}}
                                       source={require('../../../Images/up.png')}/>
                            </TouchableOpacity> : null
                    }
                </View>
            );
            ss.push(aa);
        }

        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TextInputWidget    title='来源:'  placeholder='请输入来源描述' onChangeText={(text)=>{
                    this.setState({sourceStr: text});
                }}/>
                <TextInputWidget    title='事由:'  placeholder='请输入事由描述' onChangeText={(text)=>{
                    this.setState({matter: text});
                }}/>
                {ss}
                <TextInputMultWidget  title='主要情况:'  placeholder='请输入主要情况' onChangeText={(text)=>{
                    this.setState({situation: text});
                }}/>
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>
                <TextInputWidget title='编辑人:' editable={false} value={this.state.userName} placeholder='请输入编辑人' onChangeText={(text)=>{
                    this.setState({userName: text})
                }}/>
                <TextInputWidget title='编辑时间:' editable={false} value={this.state.reportTimeStr}/>
                <TouchableOpacity style={styles.button} onPress={()=>{this.pressSumbit()}} >
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }
    _functiontimetrans(date){

        var Y = date.getFullYear()+ '-';

        var M =(date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1): date.getMonth()+1)+ '-';

        var D =(date.getDate()< 10 ? '0' +(date.getDate()): date.getDate())+ ' ';

        var h =(date.getHours()< 10 ? '0' + date.getHours(): date.getHours())+ ':';

        var m =(date.getMinutes()<10 ? '0' + date.getMinutes(): date.getMinutes())+ ':';

        var s =(date.getSeconds()<10 ? '0' + date.getSeconds(): date.getSeconds());

        return Y+M+D+h+m+s;

    }
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
                for(let i in this.state.filesList){
                    if(this.state.filesList[i].uri === response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                let tempArr = [];
                tempArr = tempArr.concat(this.state.filesList);
                let index = response.uri.indexOf('/images/') + 8;
                response['fileName'] = response.uri.substr(index, response.uri.length - index);
                tempArr.push(response);

                this.setState({
                    filesList: tempArr,
                    hasAttach:true,
                });
            }
        });
    };
    _pressDelAttach = (item)=>{
        let has = false;
        for(let i in this.state.filesList){
            if(this.state.filesList[i] === item){
                this.state.filesList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.state.filesList.length>0){
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
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };

    async pressSumbit () {
        if(this.state.sourceStr === ''){
            RRCToast.show('请输入来源');
            return;
        }
        if(this.state.matter === ''){
            RRCToast.show('请输入事由');
            return;
        }
        if(this.state.situation === ''){
            RRCToast.show('请输入主要情况');
            return;
        }
        try {
            var files = [];
            if(this.state.filesList &&  this.state.filesList.length>0){
                var formData = new FormData();
                for(let i  in this.state.filesList){
                    let file = {uri:this.state.filesList[i].uri,type:'multipart/form-data',name:this.state.filesList[i].fileName};
                    formData.append('files',file);
                }
                let res = await HttpPostFile(URLS.FileUploads,formData,"正在上传文件..");
                files = await res.data;
            }
            this.uploadNoticeInfo(files);

        } catch (e) {
            console.error(e);
        }
    }

    uploadNoticeInfo=(files)=> {
        let requestData = {};
        requestData = this.state;
        requestData['filesList'] = files;
        requestData['recordType'] = 1;    // 1，约谈  2，问责
        HttpPost(URLS.InterMentionAddApi,requestData,"正在保存..").then((response)=>{
            RRCToast.show(response.msg);
            if(response.result === 1){
                this.props.navigation.goBack();
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    };

    _addInterview=()=>{
        let arr = [];
        arr = arr.concat(this.state.interviewList);
        arr.push({
            deptName:'',
            dutyName:'',
            interviewType: '2',
            staffName: '',
        });
        this.setState({
            interviewList: arr,
        })
    };
    // _removeInterview=(index)=>{
    //     let tempList = [];
    //     tempList = tempList.concat(this.state.interviewList);
    //     tempList.splice(index, 1);
    //     console.log(tempList);
    //     this.setState((prevState) => {
    //         delete prevState.interviewList;
    //         return prevState;
    //     });
    //     this.setState({
    //         interviewList: tempList
    //     })
    //
    // };

}

const styles = StyleSheet.create({
    button:{
        margin: 8*unitWidth,
        alignItems:'flex-end',
        width:screenWidth-16,
    },

    buttonText:{
        fontSize:18,
        color:'#FFF',
        padding:12,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5,
    },
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
