import React from 'react';
import {Text, TouchableOpacity, View, SectionList, Image, Button, StyleSheet} from 'react-native';
import {screenWidth, unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import {HttpPost, HttpPostFile} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import TextInputWidget from "../../Widget/TextInputWidget";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextFileSelectWidget from "../../Widget/TextFileSelectWidget";
import ImagePicker from "react-native-image-picker";

export default class FillInAuditDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '审核详情',
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
        let id = navigation.getParam('item').id;
        let status = navigation.getParam('item').status;
        switch (index) {
            case 0:
                navigation.navigate('PAppraisalViewLog', {id: id});
                break;
            case 1:
                status === 4 || status === 5 || status === 6 ?
                    navigation.navigate('PAppraisalApproval', {id: id}) : null;
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
            URLS.ApproveDetailFillin, {id: id}, '正在查询...'
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
                    this.state.fileList ?  fileButtons  :  null
                }
                {
                    status === 3 ?
                        <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                            width:screenWidth-16*unitWidth,}} onPress={this._upLoadFiles.bind(this)}>
                            <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                                alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                                {'审核'}
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
                    title={item.deptName}/>
            </View>
        )
    };
    _upLoadFiles = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('item').id;
        this.props.navigation.navigate('FillInAuditOptions', {id: id})
    };
    _pressDetail = (attachItem)=> {
        this.props.navigation.navigate('AttachDetail',{item : attachItem});
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
});
