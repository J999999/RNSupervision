import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../../../Widget/TextFileSelectWidget";
import JQAlertBottomView from '../../../View/JQAlertBottomView';
import DataPicker from 'react-native-datepicker'
import {RRCToast} from "react-native-overlayer/src";
import ImagePicker from "react-native-image-picker";
import {screenWidth, unitWidth} from "../../../Tools/ScreenAdaptation";
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";

export default class AddIInterview extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '新增督查约谈',
    });
    constructor (props) {
        super(props);
        this.state = {
            number: '',              // 编号  文本输入框，必填。
            attachment: [],          // 附件  非必填
            submitPeople: '',        // 提交人     文本输入框，必填。
            keyword: '',             // 关键字     文本输入框，必填。
            matterSources: '1',       // 事项来源    底部弹出框，必选。
            interviewPeople: '',     // 约谈对象    文本输入框，必填。
            interviewContent: '',    // 约谈内容    文本输入框，必填。
            interviewResult: '',     // 办理结果    文本输入框，必填。
            submitDepartment: '',    // 提交科室    文本输入框，必填。
            submitTime: '',          // 提交时间    日期选择框，必填。
            finishTime: '',          // 约谈完成时间  日期选择框，非必填。（ 不填，提请发布审核框不可选 ）
        };
    }

    render(): React.ReactNode {
        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <JQAlertBottomView leftName={'事项来源'}
                                   dataSource={
                                       [
                                           {'name':'内部转办', 'id':'1'},
                                           {'name':'领导交办', 'id':'2'},
                                           {'name':'临时交办', 'id':'3'},
                                       ]
                                   }
                                   key={'事项来源'}
                                   callBack={(item) => {
                                       this.setState({matterSources: item.id});
                                   }}
                />
                <TextInputWidget    title='编号:'  placeholder='请输入编号' onChangeText={(text)=>{
                    this.setState({number: text});
                }}
                />
                <TextInputWidget    title='约谈对象:'  placeholder='请输入约谈对象' onChangeText={(text)=>{
                    this.setState({interviewPeople: text});
                }}
                />
                <TextInputMultWidget  title='约谈事项:'  placeholder='请输入约谈事项' onChangeText={(text)=>{
                    this.setState({interviewPeople: text});
                }}/>
                <TextInputMultWidget  title='约谈内容:'  placeholder='请输入约谈内容' onChangeText={(text)=>{
                    this.setState({interviewContent: text});
                }}/>
                <TextInputMultWidget  title='办理结果:'  placeholder='请输入办理结果' onChangeText={(text)=>{
                    this.setState({interviewResult: text});
                }}/>
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={()=>this.takePicture.bind(this)}/>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text>{'约谈完成时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.finishTime}
                                mode="date"
                                format="YYYY-MM-DD"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({finishTime: dateTime})}}
                                placeholder={'请选择约谈完成时间'}
                    />
                </View>
                {
                    this.state.matterSources === '1'?
                        <TextInputWidget title='提交科室:' placeholder='请输入提交科室' onChangeText={(text)=>{this.setState({submitDepartment: text});}}/> : null
                }
                {
                    this.state.matterSources === '1'?
                        <TextInputWidget title='提交人:' placeholder='请输入提交人' onChangeText={(text)=>{this.setState({submitPeople: text});}}/> : null
                }
                {
                    this.state.matterSources === '1'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text>{'提交时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.finishTime}
                                        mode="date"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({submitTime: dateTime})}}
                                        placeholder={'请选择提交时间'}
                            />
                        </View> : null
                }
                {
                    this.state.matterSources === '2'?
                        <TextInputWidget title='交办领导:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({submitDepartment: text});}}/> : null
                }
                {
                    this.state.matterSources === '2'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.finishTime}
                                        mode="date"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({submitTime: dateTime})}}
                                        placeholder={'请选择交办时间'}
                            />
                        </View> : null
                }
                {
                    this.state.matterSources === '3'?
                        <TextInputWidget title='交办人:' placeholder='请输入交办领导' onChangeText={(text)=>{this.setState({submitDepartment: text});}}/> : null
                }
                {
                    this.state.matterSources === '3'?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                            borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                            <Text>{'交办时间:'}</Text>
                            <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                        date={this.state.finishTime}
                                        mode="date"
                                        format="YYYY-MM-DD"
                                        confirmBtnText="确定"
                                        cancelBtnText="取消"
                                        showIcon={false}
                                        onDateChange={(dateTime) =>{this.setState({submitTime: dateTime})}}
                                        placeholder={'请选择交办时间'}
                            />
                        </View> : null
                }
                <TextInputMultWidget  title='关键字:'  placeholder='请输入关键字' onChangeText={(text)=>{
                    this.setState({keyword: text});
                }}/>
                <TouchableOpacity style={styles.button}    onPress={()=>this._pressSumbit.bind(this)} >
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
                let source = { uri: response.uri };

                for(let i in this.fileList){
                    if(this.fileList[i].path === response.path){
                        alert('不能重复添加');
                        return;
                    }
                }

                this.fileList.push(response);
                this.setState({
                    hasAttach:true,
                });
            }
        });

    };
    _pressSumbit = () => {

        if(this.state.matterSources === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.number === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.interviewPeople === ''){
            RRCToast.show('请输入约谈对象');
            return;
        }
        if(this.state.interviewContent === ''){
            RRCToast.show('请输入约谈内容');
            return;
        }
        if(this.state.interviewResult === ''){
            RRCToast.show('请输入办理结果');
            return;
        }
        if (this.state.keyword === ''){
            RRCToast.show('请输入关键字');
            return;
        }
        if (this.state.matterSources === '1'){
            if(this.state.submitPeople === ''){
                RRCToast.show('请输入提交人');
                return;
            }
            if(this.state.submitDepartment === ''){
                RRCToast.show('请输入提交科室');
                return;
            }
            if(this.state.submitTime === ''){
                RRCToast.show('请输入提交时间');
                return;
            }
        }


        var files = '';
        var fileIsSuccess = false;

        if(this.fileList &&  this.fileList.length>0){
            var formData = new FormData();
            for(let i  in this.fileList){
                let file = {uri:this.fileList[i].uri,type:'multipart/form-data',name:this.fileList[i].fileName};
                formData.append('files',file);
            }

            HttpPost(URLS.FileUpload,formData,"正在上传文件..").then((response)=>{
                console.log(response);
                if(response.result === 1){
                    files = response.result.data;
                    fileIsSuccess = true
                }else{
                    alert(response.msg);
                }

            }).catch((error)=>{
                RRCToast.show(error);
            });
        }else{
            fileIsSuccess = true
        }


        if(fileIsSuccess){
            let requestData = {"title":this.title,"content":this.content,"files":files};

            HttpPost(URLS.AddNotice,requestData,"正在提交..").then((response)=>{
                console.log(response);

                RRCToast.show(response.msg);
                if(response.result === 1){
                    // Toast.show("数据提交成功");
                    navigation.goBack();
                }else{
                    alert(response.msg);
                }

            }).catch((err)=>{
                RRCToast.show(err);
            });
        }
    };
}

const styles = StyleSheet.create({
    contain:{
        flex: 1,
    },
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
});
