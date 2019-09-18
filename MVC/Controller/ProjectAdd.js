import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Image, Dimensions, PixelRatio, TouchableOpacity,TouchableWithoutFeedback
} from 'react-native';
import TextInputWidget from "../Widget/TextInputWidget";
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../Widget/TextFileSelectWidget";
import TextDateSelectWidget from "../Widget/TextDateSelectWidget";
import TextSelectWidget from "../Widget/TextSelectWidget";
import ImagePicker from 'react-native-image-picker' ;
import URLS from '../Tools/InterfaceApi';
import {HttpPost, HttpPostFile} from '../Tools/JQFetch';
import {RRCToast} from 'react-native-overlayer/src';
import {KeyboardAwareScrollView} from  'react-native-keyboard-aware-scroll-view';
import DataDictionary from '../Tools/DataDictionary';
import Picker from 'react-native-picker';
import DatePicker from 'react-native-datepicker';
import {unitWidth} from '../Tools/ScreenAdaptation';

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
var screenWidth = Dimensions.get('window').width;
var navigation = null;
var attachItem = null;
class ProjectAdd  extends React.Component {

    projectInfo = {
        approvalState: null,//审批状态：1-未提交，2-待审批，3-审批通过，4-驳回
        belongType: null,//所属类别：1-省，2-郑州市，3-新郑市
        workAttr:null, //工作属性
        dutyUnitList:[], //责任单位

        leadingUnitJson:[] ,//牵头单位json
        fitUnitJson:[],//配合单位json

        fileDTOList:[],//
        files:"",

        progress: null,//进展情况：1-已完成，2-正常推进，3-临期，4-逾期
        projectCode: "",//编号
        projectInfo: "",
        projectName:'',
        projectState:null,
        projectType:2,  /////只新增领导批示

        assignLead:"",//批示领导
        assignTime:"",//交办/批示时间
        assignUnit:"",//交办单位

        finishTime: "",//完成时限
        id:null ///id
    };

    dutyUnit() {
        this.id = '';
        this.mid = '';//
        this.progress = '';//备注
        this.reportMode = 1;//汇报模式：1-周期汇报，2-固定时间点汇报
        this.reportTimeSet = '';//汇报时间设定：1-单独设置，2-与牵头单位一致
        this.reportTimeList = [];//时间设置数据
        this.superviseState = '';//
        this.unitId = '';//
        this.unitName = '';//
        this.unitType = 1 ;// 单位类型：1-牵头单位，2-配合单位

        this.reportTimeData=[];
    }
    deptUser = {
        deptCode:"",// 部门编号
        deptName:"", // 部门名称
        deptType:"",// 部门分类
        id	: "" //部门id
    };

    reportTimes() {
        this.id = '';
        this.mid = '';//父id(立项交办责任单位表id)
        this.memo = '';//备注
        this.reportTime = '';//汇报时间
        this.timeNumber = '';//时间数字（1~15）
        this.timeUnit = '';//时间单位：1-半天，2-天，3-工作日，4-周，5-月，6-季度
        this.reportMode = '';// 客户端字段 汇报模式：1-周期汇报，2-固定时间点汇报
    }

    constructor(props){
        super(props);
        navigation = this.props.navigation;

        this.fileList = [];
        this.fileUrlList =[];

        this.bean = this.projectInfo;

        this.infoCode = '1';

        this.title = '';
        this.content = '';

        this.dutyUnitUser = new this.dutyUnit() //牵头单位
        this.dutyUnitList = [] //配合单位
        // this.reportTimeList = [];//时间设置集
        this.deptUserList = []; //部门
        this.deptUserDic = {};//部门字典集
        this.selectedDeptUserId = []//已选择的单位id ,新增的时候需要排除

        this.state = {
            selectDate:'',
            isShowPick:false,
            addTimeNode:false,
            addUnit:false,
            switchTab:false,
            hasAttach:false,
            getInfoSuccess:false,
        }
     }

     componentDidMount(): void {
        if(this.bean!=null &&  this.bean.id !=null  ){
            this.getProjectInfo()
        }
        this.getDeptUser()
     }

    getProjectInfo(){
        HttpPost(URLS.ProjectDetail,{id:this.bean.id},"").then((response)=>{
            console.log(response.msg);
            if(response.result == 1){
                this.bean = response.data
                this.fileUrlList=this.bean.fileList

                if(this.bean.dutyUnitList!=null && this.bean.dutyUnitList.length>0){
                    //牵头单位
                    let leadinguser = this.bean.dutyUnitList.filter((item)=>
                        item.unitType == 1
                    )
                    this.dutyUnitUser =  leadinguser [0]
                    this.dutyUnitUser.reportTimeList.map((item)=>
                        item.reportMode = this.dutyUnitUser.reportMode
                    )

                    //配合单位
                    this.dutyUnitList = this.bean.dutyUnitList.filter((item)=>
                        item.unitType == 2
                    )
                    this.dutyUnitList.map((item)=>
                        item.reportTimeList.map((it)=>
                            it.reportMode = item.reportMode
                        )
                    )

                }

                this.setState({
                    getInfoSuccess:true
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    getDeptUser(){
        HttpPost(URLS.GetParamDept,{ids:''},"").then((response)=>{
            console.log(response.msg);
            if(response.result == 1){
                this.deptUserList = response.data
                for(let i in this.deptUserList){
                    this.deptUserDic[this.deptUserList[i].id] = this.deptUserList[i].deptName
                }
                this.setState({
                    getInfoSuccess:true
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    uploadProjectInfo=(files)=> {
        let filesss = this.fileUrlList&&this.fileUrlList.length>0 ? this.fileUrlList :[]
        filesss = filesss.concat(files)

        this.bean.fileDTOList = filesss

        // let requestData = {"projectInfo":JSON.stringify(this.bean)};

        HttpPost(URLS.SaveProject, this.bean,"正在保存..").then((response)=>{
            RRCToast.show(response.msg);
            console.log(response)
            if(response.result == 1){
                this.bean.id = response.data.id

                this.getProjectInfo()

                // navigation.state.params.callback()
                // navigation.goBack();
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    _pressSubmit=()=>{
        if(this.bean.id == null){
            RRCToast.show("请先保存信息")
            return;
        }

        HttpPost(URLS.SubmitProject, {"id":this.bean.id},"正在提交..").then((response)=>{
            // RRCToast.show(response.msg);
            // console.log(response)
            if(response.result == 1){
                navigation.state.params.callback()
                navigation.goBack();
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    _pressSave =()=> {
        //设置牵头单位和配合单位数据
        this.dutyUnitUser.reportTimeData = this.dutyUnitUser.reportTimeList.filter(item => item.reportMode == this.dutyUnitUser.reportMode )

        for(let i in this.dutyUnitList){
            let unit  = this.dutyUnitList[i]
            unit.reportTimeData  = unit.reportTimeList.filter(item => item.reportMode == unit.reportMode)
            if(unit.reportTimeSet === 2){ //与牵头单位一致
                unit.reportTimeData = []
            }
        }

        var list = []
        if(this.dutyUnitUser.reportMode){

        }
        list.push(this.dutyUnitUser)

        this.bean.leadingUnitJson =  list
        this.bean.fitUnitJson =  this.dutyUnitList

        console.log(JSON.stringify(this.bean))

        var files = []

        if(this.fileList &&  this.fileList.length>0){
            var formData = new FormData();
            for(let i  in this.fileList){
                let file = {uri:this.fileList[i].uri,type:'multipart/form-data',name:this.fileList[i].fileName};
                formData.append('files',file);
            }

             HttpPostFile(URLS.FileUploads,formData,"正在上传文件..").then((response)=>{
                if(response.result == 1){
                    files = response.data
                    this.uploadProjectInfo(files)
                 }else{
                    alert(response.msg);
                }

            }).catch((error)=>{
                RRCToast.show(err);
            });
        }else{
            this.uploadProjectInfo([])
        }

    };


    takePicture = async function() {

        ImagePicker.showImagePicker(options, (response) => {

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

                for(let i in this.fileList){
                    if(this.fileList[i].uri == response.uri){
                        alert('不能重复添加');
                        return;
                    }
                }
                if(!response.fileName){
                    response.fileName = response.uri.substring(response.uri.lastIndexOf("/")+1);
                }

                this.fileList.push(response);
                this.setState({
                    hasAttach:true,
                });
            }
        });

    };

    _pressDelAttach = (item,type)=>{
        let has = false;

        if(type === 0){
            for(let i in this.fileList){
                if(this.fileList[i] == item){
                    this.fileList.pop(item);
                    has = true;
                }
            }
        }
        if(type === 1){
            for(let i in this.fileUrlList){
                if(this.fileUrlList[i] == item){
                    this.fileUrlList.pop(item);
                    has = true;
                }
            }
        }

        if(has){
            if(this.fileList.length>0 || this.fileUrlList.length>0){
                this.setState({
                    hasAttach:true
                });
            }else{
                this.setState({
                    hasAttach:false,
                });
            }
        }
    }

    _pressDetail = ()=> {
        if(attachItem.uri===undefined){
            attachItem.uri = attachItem.url
        }
        navigation.navigate('AttachDetail',{item : attachItem});
    }

    static  navigationOptions = ({navigation}) =>({
        title: (navigation.state.params && navigation.state.params.bean )?'修改':'新增',
    });

    /**
     *
     * @param data   字典
     * @param param  字段名
     * @param type  类型（）
     * @param unit 单位对象
     */
    showPicker=(listData,param,type=1,unit)=>{
        let list = []
        for (let i in listData){
            list.push(listData[i])
        }

        this.setState({
            isShowPick:true
        })
        Picker.init({
            pickerData: list,
            selectedValue: [list[0]],
            pickerCancelBtnText: "取消",
            pickerConfirmBtnText: "确定",
            pickerTitleText: "",
            onPickerConfirm:
                data => {
                    switch (type) {
                        case 1:{
                            this.bean[param] = DataDictionary.getIndexValue(list,data)+1
                        }
                        break;
                        case 2:{
                            if(param == 'unitId'){
                                for(let i in listData){
                                    if (listData[i] == data){
                                        unit[param] = i
                                        break
                                    }
                                }
                            }else{
                                unit[param] = DataDictionary.getIndexValue(list,data)+1
                            }
                        }
                        break;
                    }

                    this.setState({
                        isShowPick:false
                    })
                },
            onPickerCancel:
                data => {
                    this.setState({
                        isShowPick:false
                    })
                },
            onPickerSelect:
                data => {
                }
        });
        Picker.show();
    }

    renderTabItem(code, label) {
        return <TouchableOpacity style={{flex: 1, alignItems: "center", justifyContent: "center"}}
                                 onPress={() => {
                                     this.infoCode = code
                                     this.setState({
                                         switchTab:true
                                     })
                                 }}
        >
            <Text
                style={{
                    color: this.infoCode === code ? '#38ADFF' : "#999999",
                    fontSize: 17,
                    paddingVertical:  15 ,
                }}>{label}</Text>
        </TouchableOpacity>;
    }

    renderViewContent=()=>{
        if(this.infoCode === '1'){
            return  this.renderNormalData()
        }else{
            return  this.renderResponseDepartmentData()
        }
    }
    renderNormalData=()=>{

      var fileButtons = [] ;

        for(let i in this.fileList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileList[i],0);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileList[i];
                            this._pressDetail();
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        } ;

        let isEditable = true
        if(this.bean.id!=null ){
            isEditable  = false
        }

      return  <KeyboardAwareScrollView style = {styles.all}>

            <View style={styles.edit}>

                <TextSelectWidget title='事项分类：' placehodler='' value = {this.bean!=null ? DataDictionary.MatterTypes[this.bean.projectType]:''}
                                  // onPress={()=>{this.showPicker(DataDictionary.MatterTypes,'projectType') }}
                />

                <TextSelectWidget title='工作属性：' placehodler='请选择'  value={this.bean!=null ? DataDictionary.WorkTypes[this.bean.workAttr]:''}
                                  onPress={()=>{ this.showPicker(DataDictionary.WorkTypes,'workAttr')
                }}/>

                <TextInputWidget  defaultValue={this.bean!=null ? this.bean.assignLead :''}  title='批示领导：'  placeholder='请输入' onChangeText={(text)=>{
                    this.bean.assignLead = text;
                }}/>

                <TextDateSelectWidget title='批示日期：' placehodler='请选择'  date={this.bean!=null ? this.bean.assignTime :''}
                                  onDateChange={(date)=>{
                                        this.bean.assignTime = date
                                  }}/>

                <TextInputWidget  defaultValue={this.bean!=null ? this.bean.projectName :''}  title='批示事项：'  placeholder='请输入' onChangeText={(text)=>{
                    this.bean.projectName = text;
                }}/>

                <TextInputMultWidget defaultValue={ this.bean!=null  ?  this.bean.projectInfo :''}  title='批示内容：'  placeholder='请输入' onChangeText={(text)=>{
                    this.bean.projectInfo = text;
                }}/>

                <TextDateSelectWidget  date={this.bean!=null ? this.bean.finishTime :''}  title='完成时限：'  placeholder='请输入'
                                       onDateChange={(date)=>{
                                           this.bean.finishTime = date
                                       }}/>

                <TextSelectWidget title='所属类别：' placehodler='请选择'  value = {this.bean!=null ? DataDictionary.BelongTypes[this.bean.belongType]:''}
                                  onPress={()=>{this.showPicker(DataDictionary.BelongTypes,'belongType')
                                  }}/>

                {/*{ (this.bean.id !=null && this.bean.id != "")? this.renderProgress(this.bean) :null}*/}

                {
                    this.state.hasAttach == true ?  fileButtons  :  null
                }

                <TextFileSelectWidget  fileName = '点 击 选 择 文 件 '  onPress={this.takePicture.bind(this)}/>

            </View>
        </KeyboardAwareScrollView>
    }

    renderResponseDepartmentData=()=>{
        let isEditable = true
        if(this.bean.id!=null ){
            isEditable  = false
        }

        var views = []
        for(let i in this.dutyUnitList){
            if(this.dutyUnitList[i].unitType == 2){
                var view  = this.renderOrgNode(this.dutyUnitList[i],isEditable)
                views.push(view)
            }
        }

        if(this.dutyUnitUser.unitId !=''){
            this.dutyUnitUser.unitName = this.deptUserDic[this.dutyUnitUser.unitId]
        }


        return <KeyboardAwareScrollView style = {styles.all}>

            <View style={styles.edit}>

                <TextSelectWidget title='牵头单位：' placehodler='请选择'  value = { this.deptUserDic[this.dutyUnitUser.unitId] }
                                  onPress={()=>{
                                      if(isEditable){
                                          this.showPicker(this.deptUserDic,'unitId',2,this.dutyUnitUser)
                                      }
                                  }}/>

                { (this.bean.id !=null && this.bean.id != "")? this.renderProgress(this.dutyUnitUser) :null}

                <TextSelectWidget title='汇报模式：' placehodler=''  value = { DataDictionary.ReportModes[this.dutyUnitUser.reportMode] }
                                  onPress={()=>{
                                      if(isEditable){
                                          this.showPicker(DataDictionary.ReportModes,'reportMode',2,this.dutyUnitUser)
                                      }
                }}/>

                {
                   this.dutyUnitUser.reportMode === 1 ? this.renderPeroidNode(this.dutyUnitUser,isEditable):this.renderFixTimeNode(this.dutyUnitUser,isEditable)
                }

                {isEditable && <Button title="添加配合单位" onPress={ ()=>{
                    let unit = new this.dutyUnit()
                    unit.unitType = 2
                    this.dutyUnitList.push(unit)

                    this.setState(
                        { addUnit : true}
                    )
                }} />}

                { this.state.addUnit == true || this.dutyUnitList.length > 0  ? views : null}

            </View>
        </KeyboardAwareScrollView>
    }

    renderProgress(unit){
        return (<View>
            <TextSelectWidget title='进展情况：' placehodler='请选择'  value = { DataDictionary.ProgressTypes[unit.progress] }
                                 onPress={()=>{this.showPicker(DataDictionary.ProgressTypes,'progress',2,unit)
                                 }}/>

            <TextSelectWidget title='督查状态：' placehodler='请选择'  value = { DataDictionary.SuperViseStates[unit.superviseState] }
                                onPress={()=>{this.showPicker(DataDictionary.SuperViseStates,'superviseState',2,unit)
                                }}/>
        </View>);
    }

    //配合单位
    renderOrgNode(unit,isEditable){
        if(unit.unitId !=''){
            unit.unitName = this.deptUserDic[unit.unitId]
        }

        return (

            <View style={styles.edit}>

                <View style={{height: 8, backgroundColor: '#f5f5f5'}}/>

                <TextSelectWidget title='配合单位：' placehodler='请选择'  value = { this.deptUserDic[unit.unitId]  }
                                  onPress={()=>{
                                      if(isEditable){
                                          this.showPicker(this.deptUserDic,'unitId',2,unit)

                                      }
                                  }}/>

                { (this.bean.id !=null && this.bean.id != "")? this.renderProgress(unit): null}

                <TextSelectWidget title='汇报时间设定：' placehodler=''  value = { DataDictionary.ReportTimeSet[unit.reportTimeSet] }
                                  onPress={()=>{
                                      if(isEditable){
                                          this.showPicker(DataDictionary.ReportTimeSet,'reportTimeSet',2,unit)
                                      }
                                  }}/>
                {unit.reportTimeSet === 1 && <View >
                    <TextSelectWidget title='汇报模式：' placehodler=''  value = { DataDictionary.ReportModes[unit.reportMode] }
                                      onPress={()=>{
                                          if(isEditable){
                                              this.showPicker(DataDictionary.ReportModes,'reportMode',2,unit)
                                          }
                                      }}/>

                    {
                        unit.reportMode === 1 ? this.renderPeroidNode(unit,isEditable):this.renderFixTimeNode(unit,isEditable)
                    }

                </View>}

            </View>

        );
    }

    renderPeroidNode(unit,isEditable){
        if(unit.reportTimeList.length<1){
            let time = new this.reportTimes()
            time.reportMode=1
            unit.reportTimeList.push(time)
        }

        return <View >

            <TextDateSelectWidget title='首次汇报时间：' placehodler='请选择'  date={unit.reportTimeList[0].reportTime}
                                  onDateChange={(date)=>{
                                      if(isEditable){
                                          unit.reportTimeList[0].reportTime = date
                                      }

                                  }}
                                  // disabled = {!isEditable}
            />

            <View style={selectStyles.row}>
                <Text style={selectStyles.textInputTitle}>每</Text>
                <Text style={{width:80*unitWidth}}  onPress={()=>{
                    if(isEditable){
                        this.showPicker(DataDictionary.TimeValue,'timeNumber',2,unit.reportTimeList[0])
                    }

                }}>
                    {
                        DataDictionary.TimeValue[unit.reportTimeList[0].timeNumber] == undefined ? "请选择" : DataDictionary.TimeValue[unit.reportTimeList[0].timeNumber]
                    }
                </Text>
                <Text style={{width:80*unitWidth}} onPress={()=>{
                    if(isEditable){
                        this.showPicker(DataDictionary.TimeUnitTypes,'timeUnit',2,unit.reportTimeList[0])
                    }
                }}>
                    { DataDictionary.TimeUnitTypes[unit.reportTimeList[0].timeUnit] == undefined ? "请选择" : DataDictionary.TimeUnitTypes[unit.reportTimeList[0].timeUnit]}
                </Text>
                <Text style={selectStyles.textInputTitle}>汇报一次</Text>
            </View>

        </View>
    }
    renderFixTimeNode(unit,isEditable){

        var views = []
        for(let i in unit.reportTimeList){
            if( unit.reportTimeList[i].reportMode == 2 ){
                var view  = (<View style={[selectStyles.row,{justifyContent:'space-between'}]}>
                    <DatePicker
                        style={selectStyles.textInputTime}
                        date={ unit.reportTimeList[i].reportTime }
                        mode="date"
                        showIcon={false}
                        placeholder="请选择时间"
                        format="YYYY-MM-DD"
                        minDate="2000-01-01"
                        maxDate="2060-01-01"
                        confirmBtnText="确认"
                        cancelBtnText="取消"
                        customStyles={{
                            dateInput: {
                                width:100,
                                alignItems: 'flex-start',
                                borderColor: '#ffffff'
                            }
                        }}
                        onDateChange={(date) => {
                            if(isEditable){
                                date += ' 00:00:00'
                                unit.reportTimeList[i].reportTime = date
                                this.setState({
                                    selectDate:date
                                })
                            }
                        }}
                        // disabled={!isEditable}
                    />
                    <TextInput style={[selectStyles.textInputTime,{width:screenWidth-120*unitWidth,paddingRight:3*unitWidth,}]} underlineColorAndroid='transparent' numberOfLines={1}  placeHolder={'请输入'} defaultValue = {unit.reportTimeList[i].memo} onChangeText={
                        (text)=>{
                             unit.reportTimeList[i].memo = text
                        }
                    }
                        editable = {isEditable}
                    />
                </View>)
                views.push(view)
            }
        }

        return <View>
            {isEditable&& <Button title="新增汇报节点" onPress={()=>{
                let time = new this.reportTimes()
                time.reportMode = 2
                unit.reportTimeList.push(time)
                this.setState({
                    addTimeNode:true,
                })
            }} />}
            <View style={[selectStyles.row,{justifyContent:'space-between'}]}>
                <Text style={selectStyles.textInputTime}>汇报节点</Text><Text style={selectStyles.textInputTime}>备注</Text>
            </View>
            {this.state.addTimeNode == true || views.length>0 ? views : null}
        </View>
    }

    render(){
        const  {params} = this.props.navigation.state;
        if(this.bean.id == null  && params && params.bean){
            this.bean  = params.bean
        }

        var fileButtons = [] ;

        for(let i in this.fileList){
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileList[i].fileName} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileList[i],0);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileList[i];
                            this._pressDetail();
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        } ;


        for(let j in this.fileUrlList){
            var buttonUrl = (
                <View
                    key = {j}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ this.fileUrlList[j].name} </Text>
                    <TouchableOpacity style={styles.rightIcon} onPress={()=>{
                        this._pressDelAttach(this.fileUrlList[j],1);
                    }}>
                        <Image style={styles.delete} source={require('../Images/sc_delete.png')}   />
                    </TouchableOpacity>

                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            attachItem = this.fileUrlList[j];
                            this._pressDetail();
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(buttonUrl);
        }

        return (
            <View style = {styles.all}>

                <View style={{flexDirection: 'row'}}>
                    {this.renderTabItem("1", '基本信息')}
                    {this.renderTabItem("2", '责任单位')}
                </View>

                <View style={{height: 8*unitWidth, backgroundColor: '#f5f5f5'}}/>

                {this.renderViewContent()}

                <View style={{height: 56*unitWidth, backgroundColor: '#ffffff'}}/>

                <View style={{flexDirection:'row',justifyContent: 'space-between',position:'absolute',bottom:0,right:0,left:0}}>
                    <TouchableOpacity style={styles.button}    onPress={this._pressSave} >
                        <Text style={styles.buttonText}>保存</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}    onPress={this._pressSubmit} >
                        <Text style={styles.buttonText}>提交审核</Text>
                    </TouchableOpacity>
                </View>

                {this.state.isShowPick && <TouchableWithoutFeedback
                    onPress={() => {
                        Picker.hide();
                        this.setState({
                            isShowPick:false
                        })
                    }}
                >
                    <View
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        }}></View>
                </TouchableWithoutFeedback>}
            </View>
        );
    }
}

var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#ffffff',
     },

    edit:{
      flex:1,
    },

    button:{
        margin:8*unitWidth,
        // alignItems:'flex-end',
        width:screenWidth/2,
    },

    buttonText:{
        fontSize:18*unitWidth,
        color:'#FFF',
        padding:12*unitWidth,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5*unitWidth,
    },

    attach:{
        width:screenWidth,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'center',
        // justifyContent:'space-between',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    attachText:{
        flex:1,
        marginLeft:10*unitWidth,
        marginTop:15*unitWidth,
        marginBottom:15*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
    },

    rightIcon:{
        margin: 10*unitWidth,
    },

    delete:{
        width:30*unitWidth,
        height:29*unitWidth,
    },


})


const selectStyles = {
    rowContainer: {
        backgroundColor: '#FFF',
        width:screenWidth,
    },
    row: {
        flexDirection: 'row',
        height: 55*unitWidth,
        alignItems: 'center',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    textInputTitle: {
        width: 80*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
        marginLeft: 15*unitWidth,
    },

    textInputTime:{
        alignSelf:'center',
        paddingRight: 10*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
        marginLeft: 15*unitWidth
    },


}


module.exports = ProjectAdd
