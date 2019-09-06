import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Button, PixelRatio} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../../../Widget/TextFileSelectWidget";
import JQAlertBottomView from '../../../View/JQAlertBottomView';
import DataPicker from 'react-native-datepicker'
import {RRCToast} from "react-native-overlayer/src";
import ImagePicker from "react-native-image-picker";
import {screenWidth, unitWidth} from "../../../Tools/ScreenAdaptation";
import {HttpPost, HttpPostFile} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";

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

export default class AddIInterview extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '新增督查约谈',
    });
    constructor (props) {
        super(props);
        this.state = {
            billCode: '',              // 编号  文本输入框，必填。
            fileList: [],              // 附件  非必填
            userName: '',              // 提交人     文本输入框，必填。
            keywordStr: '',            // 关键字     文本输入框，必填。
            sourceType: '1',           // 事项来源    底部弹出框，必选。
            interviewName: '',         // 约谈对象    文本输入框，必填。
            matter: '',                // 约谈事项    文本输入框，必填。
            situation: '',             // 约谈内容    文本输入框，必填。
            processingResults: '',     // 办理结果    文本输入框，必填。
            userDeptName: '',          // 提交科室    文本输入框，必填。
            reportTimeStr: '',         // 提交时间    日期选择框，必填。
            finishTimeStr: '',         // 约谈完成时间  日期选择框，非必填。（ 不填，提请发布审核框不可选 ）
            hasAttach:false,           // 附件相关，与上传数据无关
        };
    }

    render(): React.ReactNode {
        var fileButtons = [] ;

        for(let i in this.state.fileList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.state.fileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.state.fileList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
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
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <JQAlertBottomView leftName={'事项来源'}
                                   enabledEdit={true}
                                   dataSource={
                                       [
                                           {'name':'内部转办', 'id':'1'},
                                           {'name':'领导交办', 'id':'2'},
                                           {'name':'临时交办', 'id':'3'},
                                       ]
                                   }
                                   key={'事项来源'}
                                   callBack={(item) => {
                                       this.setState({sourceType: item.id});
                                   }}
                />
                <TextInputWidget    title='编号:'  placeholder='请输入编号' onChangeText={(text)=>{
                    this.setState({billCode: text});
                }}
                />
                <TextInputWidget    title='约谈对象:'  placeholder='请输入约谈对象' onChangeText={(text)=>{
                    this.setState({interviewName: text});
                }}
                />
                <TextInputMultWidget  title='约谈事项:'  placeholder='请输入约谈事项' onChangeText={(text)=>{
                    this.setState({matter: text});
                }}/>
                <TextInputMultWidget  title='约谈内容:'  placeholder='请输入约谈内容' onChangeText={(text)=>{
                    this.setState({situation: text});
                }}/>
                <TextInputMultWidget  title='办理结果:'  placeholder='请输入办理结果' onChangeText={(text)=>{
                    this.setState({processingResults: text});
                }}/>
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'约谈完成时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.finishTimeStr}
                                mode="date"
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({finishTimeStr: dateTime})}}
                                placeholder={'请选择约谈完成时间'}
                    />
                </View>
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget title='提交科室:' placeholder='请输入提交科室' onChangeText={(text)=>{this.setState({userDeptName: text});}}/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget title='提交人:' placeholder='请输入提交人' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'提交时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={'请选择提交时间'}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '2'?
                        <TextInputWidget title='交办领导:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '2'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={'请选择交办时间'}
                            />
                        </View> : null
                }
                {
                    this.state.sourceType === '3'?
                        <TextInputWidget title='交办人:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
                }
                {
                    this.state.sourceType === '3'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text style={{fontSize: 15*unitWidth}}>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.reportTimeStr}
                                        mode="date"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({reportTimeStr: dateTime})}}
                                        placeholder={'请选择交办时间'}
                            />
                        </View> : null
                }
                <TextInputMultWidget  title='关键字:'  placeholder='请输入关键字' onChangeText={(text)=>{
                    this.setState({keywordStr: text});
                }}/>
                <TouchableOpacity style={styles.button} onPress={this._pressSumbit} >
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
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
                for(let i in this.state.fileList){
                    if(this.state.fileList[i].uri === response.uri){
                        alert('不能重复添加');
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
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };

    _pressSumbit = () => {
        if(this.state.sourceType === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.billCode === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.interviewName === ''){
            RRCToast.show('请输入约谈对象');
            return;
        }
        if(this.state.situation === ''){
            RRCToast.show('请输入约谈内容');
            return;
        }
        if(this.state.processingResults === ''){
            RRCToast.show('请输入办理结果');
            return;
        }
        if (this.state.keywordStr === ''){
            RRCToast.show('请输入关键字');
            return;
        }
        if (this.state.sourceType === '1'){
            if(this.state.userName === ''){
                RRCToast.show('请输入提交人');
                return;
            }
            if(this.state.userDeptName === ''){
                RRCToast.show('请输入提交科室');
                return;
            }
            if(this.state.reportTimeStr === ''){
                RRCToast.show('请输入提交时间');
                return;
            }
        }
        if (this.state.sourceType === '2'){
            if(this.state.userName === ''){
                RRCToast.show('请输入交办领导');
                return;
            }
        }
        if (this.state.sourceType === '3'){
            if(this.state.userName === ''){
                RRCToast.show('请输入交办人');
                return;
            }
        }
        if(this.state.reportTimeStr === ''){
            RRCToast.show('请输入交办时间');
            return;
        }
        var files = [];

        if(this.state.fileList &&  this.state.fileList.length>0){
            var formData = new FormData();
            for(let i  in this.state.fileList){
                let file = {uri:this.state.fileList[i].uri,type:'multipart/form-data',name:this.state.fileList[i].fileName};
                formData.append('files',file);
            }

            HttpPostFile(URLS.FileUploads,formData,"正在上传文件..").then((response)=>{
                if(response.result === 1){
                    files = response.data;
                    this.uploadNoticeInfo(files)
                }else{
                    alert(response.msg);
                }

            }).catch((error)=>{
                RRCToast.show(err);
            });
        }else{
            this.uploadNoticeInfo([])
        }
    };

    uploadNoticeInfo=(files)=> {
        let requestData = {};
        requestData = this.state;
        requestData['filesList'] = files;
        requestData['recordType'] = 1;    // 1，约谈  2，问责
        delete requestData.fileList;
        HttpPost(URLS.AddIAImplementInfo,requestData,"正在保存..").then((response)=>{
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
