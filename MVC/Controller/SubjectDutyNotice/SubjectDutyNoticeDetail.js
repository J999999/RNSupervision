import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image, Button, TextInput} from 'react-native';
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import TextInputWidget from "../../Widget/TextInputWidget";
import TextInputMultWidget from "../../Widget/TextInputMultWidget";
import {HttpPost} from "../../Tools/JQFetch";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import OpenFile from 'react-native-doc-viewer'
import URLS from "../../Tools/InterfaceApi";

export default class SubjectDutyNoticeDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '通知详情',
        // headerRight: (<TouchableOpacity activeOpacity={.5}
        //                                 onPress={()=>{navigation.state.params.rightOnPress()}}>
        //     <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'阅读情况'}</Text>
        // </TouchableOpacity>)
    });
    // _ClickHeaderRightAction = () => {
    //     this.props.navigation.navigate('SubjectDutyNoticeRead', {});
    // };
    componentDidMount(): void {
        //this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.SubjectDutyNoticeDetail, {id:id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                let model = response['data'];
                this.setState({
                    content: model.content,
                    creatorName: model.creatorName,
                    filesList: model.fileList ? model.fileList: [],
                    publishTimeStr: model.publishTimeStr,
                    showState: model.state === 1 ? '已发布' : '已撤回',
                    title: model.title,
                });
            }
        }).catch((err)=>{
            console.log(err);
        })
    }
    constructor (props) {
        super(props);
        this.state = {
            content: '',
            creatorName: '',
            filesList: [],
            publishTimeStr: '',
            showState: '',
            title: '',
        };
    }
    render(): React.ReactNode {

        var fileButtons = [] ;
        this.state.filesList.map((i, key) => {
            let nameStr = i.name ? i.name : i.fileName;
            var button = (
                <View
                    key={key}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
                    <View style={styles.rightIcon}>
                        <Button title="查看" onPress={ ()=>{
                            this._pressDetail(i)
                        }}   />
                    </View>
                </View>
            );
            fileButtons.push(button);
        });

        return (
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <TextInputWidget editable={false} value={this.state.title}  title='标题:'/>
                <TextInputWidget editable={false} value={this.state.creatorName}  title='发布人:'/>
                <TextInputWidget editable={false} value={this.state.showState}  title='状态:'/>
                <TextInputWidget editable={false} value={this.state.publishTimeStr}  title='发布时间:'/>
                <TextInputMultWidget editable={false} value={this.state.content} title='内容:'/>
                {
                    this.state.filesList.length > 0 ?  fileButtons  :  null
                }
            </KeyboardAwareScrollView>
        )
    }
    _pressDetail = (attachItem)=> {
        if (Platform.OS === 'ios') {
            OpenFile.openDoc([{
                url: FILE_HOST + attachItem.url,
                fileNameOptional: attachItem.name
            }], (error, url)=>{

            })
        }else {
            let uriSuffix = attachItem.url.substr(attachItem.url.lastIndexOf(".")+1).toLowerCase();
            OpenFile.openDoc([{
                url: FILE_HOST + attachItem.url,
                fileName: attachItem.name,
                fileType: uriSuffix,
                cache: true,
            }], (error, uri)=>{
            })
        }
    };
};
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
