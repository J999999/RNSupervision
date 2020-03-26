import React from 'react';
import {Button, Image, Text, TouchableOpacity, View} from 'react-native';
import {HttpPost} from "../../../Tools/JQFetch";
import URLS from "../../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import TextInputWidget from "../../../Widget/TextInputWidget";
import TextInputMultWidget from "../../../Widget/TextInputMultWidget";
import TextFileSelectWidget from "../../../Widget/TextFileSelectWidget";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default class BatchForms extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '呈批表',
    });
    constructor (){
        super ();
        this.state = {
            enabledEdit: false,
            sources: '', //来源
            cause: '',   //事由
            interviewUser: '',  //约谈对象
            mainSituation: '',  //主要原因
            filesList: [],      //附件
        }
    }
    componentDidMount(): void {
        const {navigation} = this.props;
        let id = navigation.getParam('id');
        HttpPost(URLS.QueryTPIAApplicationById,{id: id}, '正在查询...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                this.setState({
                    sources: response.data.sources,
                    cause: response.data.cause,
                    interviewUser: response.data.interviewUser,
                    mainSituation: response.data.mainSituation,
                    filesList: response.data.filesList,
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    }
    render(): React.ReactNode {
        var fileButtons = [] ;

        for(let i in this.state.filesList){
            let nameStr = this.state.filesList[i].name ? this.state.filesList[i].name : this.state.filesList[i].fileName;
            var button = (
                <View
                    key = {i}
                    style= {styles.attach} >
                    <Text numberOfLines={1} style={styles.attachText}> {'附件：'+ nameStr} </Text>
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
        return (
            <View style={{flex: 1}}>
                <TextInputWidget
                    editable={this.state.enabledEdit}
                    value={this.state.sources}
                    title='来源:'
                />
                <TextInputMultWidget
                    editable={this.state.enabledEdit}
                    value={this.state.cause}
                    title='事由:'
                />
                <TextInputMultWidget
                    editable={this.state.enabledEdit}
                    value={this.state.interviewUser}
                    title='约谈对象:'
                />
                <TextInputMultWidget
                    editable={this.state.enabledEdit}
                    value={this.state.mainSituation}
                    title='主要情况:'
                />
                {
                    this.state.filesList ? fileButtons: null
                }
            </View>
        )
    }
}
