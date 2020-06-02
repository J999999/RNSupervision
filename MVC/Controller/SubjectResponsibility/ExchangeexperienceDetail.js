import React from 'react';
import {Button, Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import TextInputWidget from "../../Widget/TextInputWidget";
import TextInputMultWidget from "../../Widget/TextInputMultWidget";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import OpenFile from "react-native-doc-viewer";

export default class ExchangeexperienceDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '交流详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'系统记录'}</Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        this.props.navigation.navigate('ExchangeexperienceLog', {id: id});
    };
    constructor (){
        super ();
        this.state = {
            enableEdit: false,
            title: '', //标题
            content: '', //内容
            creatorName: '', //创建人姓名
            deptName: '', //发布单位
            createTimeStr: '', //发布时间
            fileList: [], //附件
            replyList: [], //回复详情
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.QueryDetailByExchangeexperience, {id:id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                let model = response['data'];
                this.setState({
                    title: model.title,
                    content: model.content,
                    creatorName: model.creatorName,
                    timeLimit: model.timeLimit,
                    deptName: model.deptName,
                    createTimeStr: model.createTimeStr,
                    fileList: model.fileList,
                    replyList: model.replyList,
                });
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    }
    render(): React.ReactNode {

        var fileButtons = [] ;

        for(let i in this.state.fileList){
            let nameStr = this.state.fileList[i].name ? this.state.fileList[i].name : this.state.fileList[i].fileName;
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
            <KeyboardAwareScrollView>
                <View style={{flex: 1}}>
                    <TextInputWidget editable={this.state.enabledEdit} value={this.state.creatorName}  title='发布人:'/>
                    <TextInputWidget editable={this.state.enabledEdit} value={this.state.deptName}  title='发布单位:'/>
                    <TextInputWidget editable={this.state.enabledEdit} value={this.state.createTimeStr}  title='发布时间:'/>
                    <TextInputWidget editable={this.state.enabledEdit} value={this.state.title}  title='标题:'/>
                    <TextInputMultWidget editable={this.state.enabledEdit} value={this.state.content} title='内容:'/>
                    {
                        this.state.fileList ?  fileButtons  :  null
                    }
                    {
                        this.state.replyList.map((i)=>{
                            return (
                                <View
                                    style={{
                                        borderBottomWidth: unitWidth,
                                        borderBottomColor: '#F4F4F4',
                                        marginLeft: 20*unitWidth,
                                        marginRight: 20*unitWidth,
                                    }}>
                                    <Text style={{marginTop: 5*unitWidth}}>{'回复人: ' + i.creatorName}</Text>
                                    <Text style={{marginTop: 5*unitWidth}}>{'回复时间: ' + i.createTimeStr}</Text>
                                    <Text
                                        numberOfLines={0}
                                        style={{marginTop: 5*unitWidth, marginBottom: 5*unitWidth}}>
                                        {'回复内容: ' + i.content}
                                    </Text>
                                </View>
                            )
                        })
                    }
                    {
                        this.props.navigation.getParam('hasButton') === true ?
                            <TouchableOpacity style={styles.button} onPress={this._optionsAction} >
                                <Text style={styles.buttonText}>
                                    {'审核'}
                                </Text>
                            </TouchableOpacity>: null
                    }
                </View>
            </KeyboardAwareScrollView>
        )
    }
    _optionsAction = () => {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        let type = navigation.getParam('approveType');
        navigation.navigate('ApprovalWorkOptions', {id: id, approveType: type, key: navigation.state.key});
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
    button:{
        margin: 10*unitWidth,
        alignItems:'flex-end',
        width:screenWidth-16*unitWidth,
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
        borderBottomWidth: unitWidth,
        borderColor:'#F4F4F4',//需要标色
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

});
