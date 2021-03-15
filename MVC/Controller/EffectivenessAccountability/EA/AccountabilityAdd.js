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

var _that;

export default class AccountabilityAdd extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '新增效能问责',
    });
    constructor (props) {
        super(props);
        _that = this;
        this.state = {
            billCode: '',              // 编号  文本输入框，必填。
            symbolCode: '',            // 文号  文本输入框，必填。
            fileList: [],              // 附件  非必填
            reFileList: [],
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
            reAttach: false,
            interviewType: '',         // 问责类型 1-单位  2-个人
            interviewList: [],
            releaseType: '',           // 是否发布  1-发布   2-不发布
            visualRange: '',             // 可视范围名字显示
            visualRangeList: '',             // 可视范围ids
            releaseTime: '',       //发布时间
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

        var reFileButtons = [];
        for (let i = 0; i < this.state.reFileList.length; i++){
            var reButton = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.state.reFileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this.rePressDelAttach(this.state.reFileList[i]);
                    }}>
                        <Image style={styles.delete} source={require('../../../Images/sc_delete.png')}/>
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this.rePressDetail(this.state.reFileList[i])
                        }}   />
                    </View>
                </View>
            );
            reFileButtons.push(reButton);
        }

        var deptButtons = [];
        for (let j=0; j<this.state.interviewList.length; j++) {

            let dept = (
                <View style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center', borderBottomWidth: unitWidth , borderColor: '#F4F4F4'}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333', marginLeft: 15*unitWidth}}>
                        {j === 0 ? '问责单位:' : ''}
                    </Text>
                    <View style={{width: 245*unitWidth}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 44*unitWidth}}>
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
                    </View>
                    {
                        j === 0 ?
                            <TouchableOpacity onPress={()=>{this._addDept()}}>
                                <Image style={{marginRight: 10*unitWidth, width:25*unitWidth, height:25*unitWidth}}
                                       source={require('../../../Images/up.png')}/>
                            </TouchableOpacity> : null
                    }
                </View>
            );
            deptButtons.push(dept);
        }

        var interButtons = [];
        for (let j=0; j<this.state.interviewList.length; j++) {

            let inter = (
                <View style={{flexDirection: 'row', height: 94*unitWidth, alignItems: 'center', borderBottomWidth: unitWidth , borderColor: '#F4F4F4'}}>
                    <Text style={{width: 80*unitWidth, fontSize: 15*unitWidth, color: '#333', marginLeft: 15*unitWidth}}>
                        {j === 0 ? '问责对象:' : ''}
                    </Text>
                    <View style={{width: 245*unitWidth}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 44*unitWidth}}>
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
                        <View style={{flexDirection: 'row', alignItems: 'center', height: 44*unitWidth}}>
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
                            <TouchableOpacity onPress={()=>{this._addDept()}}>
                                <Image style={{marginRight: 10*unitWidth, width:25*unitWidth, height:25*unitWidth}}
                                       source={require('../../../Images/up.png')}/>
                            </TouchableOpacity> : null
                    }
                </View>
            );
            interButtons.push(inter);
        }
        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TextInputWidget    title='编号:'  placeholder='请输入编号' onChangeText={(text)=>{
                    this.setState({billCode: text});
                }}
                />
                {
                    this.state.reAttach === true ? reFileButtons : null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.reTakePicture.bind(this)}/>
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
                <JQAlertBottomView leftName={'问责类型'}
                                   enabledEdit={true}
                                   dataSource={
                                       [
                                           {'name':'问责单位', 'id':'1'},
                                           {'name':'问责对象', 'id':'2'},
                                       ]
                                   }
                                   key={'问责类型'}
                                   callBack={(item) => {
                                       this.setState({
                                           interviewType: item.id,
                                           interviewList: [{
                                               deptName:'',
                                               dutyName:'',
                                               interviewType: item.id,
                                               staffName: '',
                                           }],
                                       });
                                   }}
                />
                {
                    this.state.interviewType === '' ? null :
                        (this.state.interviewType === '1' ? deptButtons : interButtons)
                }
                <TextInputMultWidget  title='问责事项:'  placeholder='请输入问责事项' onChangeText={(text)=>{
                    this.setState({matter: text});
                }}/>
                <TextInputMultWidget  title='问责内容:'  placeholder='请输入问责内容' onChangeText={(text)=>{
                    this.setState({situation: text});
                }}/>
                <TextInputMultWidget  title='办理结果:'  placeholder='请输入办理结果' onChangeText={(text)=>{
                    this.setState({processingResults: text});
                }}/>
                <TextInputWidget    title='文号:'  placeholder='请输入文号' onChangeText={(text)=>{
                    this.setState({symbolCode: text});
                }}
                />
                {
                    this.state.hasAttach === true ?  fileButtons  :  null
                }
                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'发文时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.finishTimeStr}
                                mode="date"
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({finishTimeStr: dateTime})}}
                                placeholder={'请选择发文时间'}
                    />
                </View>
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget title='提交科室:' placeholder='请输入提交科室' onChangeText={(text)=>{this.setState({userDeptName: text});}}/> : null
                }
                {
                    this.state.sourceType === '1'?
                        <TextInputWidget value={this.state.userName} title='提交人:' placeholder='请输入提交人' onChangeText={(text)=>{this.setState({userName: text});}}/> : null
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
                <JQAlertBottomView leftName={'是否发布'}
                                   enabledEdit={true}
                                   dataSource={
                                       [
                                           {'name':'发布', 'id':'1'},
                                           {'name':'不发布', 'id':'2'},
                                       ]
                                   }
                                   key={'是否发布'}
                                   callBack={(item) => {
                                       this.setState({releaseType: item.id});
                                   }}
                />
                {
                    this.state.releaseType === '1' ?
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('GetDeptInfo',{callback: function (data) {
                                let nameArr = [];
                                let idsArr = [];
                                for (let i = 0; i < data.length; i++){
                                    nameArr.push(data[i].deptName);
                                    idsArr.push(data[i].id);
                                }
                                let nameStr = nameArr.join(',');
                                _that.setState({
                                    visualRange: nameStr,
                                    visualRangeList: idsArr,
                                })
                            }})}}>
                            <TextInputWidget    title='可视范围:'  placeholder='请选择可视范围' editable={false} value={this.state.visualRange}/>
                        </TouchableOpacity> : null
                }
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 15*unitWidth,
                    borderBottomWidth: unitWidth, borderBottomColor:'#F4F4F4', height: 54*unitWidth}}>
                    <Text style={{fontSize: 15*unitWidth}}>{'发布时间:'}</Text>
                    <DataPicker style={{width: 200*unitWidth, marginLeft: 5*unitWidth}}
                                date={this.state.releaseTime}
                                mode="date"
                                format="YYYY-MM-DD HH:mm:ss"
                                confirmBtnText="确定"
                                cancelBtnText="取消"
                                showIcon={false}
                                onDateChange={(dateTime) =>{this.setState({releaseTime: dateTime})}}
                                placeholder={'请选择发布时间'}
                    />
                </View>
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
                <TouchableOpacity style={styles.button} onPress={()=>{this.pressSumbit()}} >
                    <Text style={styles.buttonText}>提交</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        )
    }

    reTakePicture = async function() {

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
                for(let i in this.state.reFileList){
                    if(this.state.reFileList[i].uri === response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                let tempArr = [];
                tempArr = tempArr.concat(this.state.reFileList);
                let index = response.uri.indexOf('/images/') + 8;
                response['fileName'] = response.uri.substr(index, response.uri.length - index);
                tempArr.push(response);

                this.setState({
                    reFileList: tempArr,
                    reAttach:true,
                });
            }
        });
    };
    rePressDelAttach = (item)=>{
        let has = false;
        for(let i in this.state.reFileList){
            if(this.state.reFileList[i] === item){
                this.state.reFileList.pop(item);
                has = true;
            }
        }
        if(has){
            if(this.state.reFileList.length>0){
                this.setState({
                    reAttach:true
                });
            }else{
                this.setState({
                    reAttach:false,
                });
            }
        }
    };
    rePressDetail = (attachItem)=> {
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
    };

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
    async pressSumbit () {
        if(this.state.sourceType === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.billCode === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.situation === ''){
            RRCToast.show('请输入问责内容');
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
        if (this.state.releaseType === '1' && this.state.visualRangeList.length === 0) {
            RRCToast.show('请选择可视范围');
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
        try {
            var files = [];
            var reFiles = [];
            if(this.state.fileList &&  this.state.fileList.length>0){
                var formData = new FormData();
                for(let i  in this.state.fileList){
                    let file = {uri:this.state.fileList[i].uri,type:'multipart/form-data',name:this.state.fileList[i].fileName};
                    formData.append('files',file);
                }
                let res = await HttpPostFile(URLS.FileUploads,formData,"正在上传文件..");
                files = await res.data;
            }
            if (this.state.reFileList && this.state.reFileList.length > 0) {
                let reFormData = new FormData();
                for (let i = 0; i < this.state.reFileList.length; i++){
                    let file = {uri:this.state.reFileList[i].uri,type:'multipart/form-data',name:this.state.reFileList[i].fileName};
                    reFormData.append('files',file);
                }
                let res = await HttpPostFile(URLS.FileUploads,reFormData,"正在上传文件..");
                reFiles = await res.data;
            }
            this.uploadNoticeInfo(files, reFiles);

        } catch (e) {
            console.error(e);
        }
    }
    /*
    _pressSumbit = () => {
        if(this.state.sourceType === ''){
            RRCToast.show('请选择事项来源');
            return;
        }
        if(this.state.billCode === ''){
            RRCToast.show('请输入编号');
            return;
        }
        if(this.state.symbolCode === ''){
            RRCToast.show('请输入文号');
            return;
        }

        if(this.state.situation === ''){
            RRCToast.show('请输入问责内容');
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
*/
    uploadNoticeInfo=(files, reFiles)=> {
        let requestData = {};
        requestData = this.state;
        requestData['filesList'] = files;
        requestData['reFilesList'] = reFiles;
        requestData['recordType'] = 2;    // 1，约谈  2，问责
        delete requestData.fileList;
        delete requestData.reFileList;
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

    _addDept = () => {
        let arr = [];
        arr = arr.concat(this.state.interviewList);
        arr.push({
            deptName:'',
            dutyName:'',
            interviewType: this.state.interviewType,
            staffName: '',
        });
        this.setState({
            interviewList: arr,
        })
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
