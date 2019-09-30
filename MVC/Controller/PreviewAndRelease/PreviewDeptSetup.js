import React from 'react';
import {View, SectionList, Text, TouchableOpacity} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {screenWidth, unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import TextInputWidget from "../../Widget/TextInputWidget";

export default class PreviewDeptSetup extends React.Component{
    static navigationOptions = {
        title: '加分项设置'
    };
    constructor () {
        super ();
        this.state = {
            data: [],
        }

    }
    componentDidMount(): void {
        let swId = this.props.navigation.getParam('item').swId;

        HttpPost(URLS.GetDeptSetup, {swId: swId}, '正在加载...').then((response)=>{
            if (response.result === 1) {
                let plusesNameArr = [];
                let plusesArr = [];
                for (let i=0; i<response.data.length; i++) {
                    if (plusesNameArr.indexOf(response.data[i].plusesName) === -1) {
                        plusesNameArr.push(response.data[i].plusesName);
                        plusesArr.push({title: response.data[i].plusesName, data:[]})
                    }
                }
                for (let i=0; i<response.data.length; i++) {
                    for (let j=0; j<plusesArr.length; j++) {
                        if (response.data[i].plusesName === plusesArr[j].title) {
                            plusesArr[j].data.push(response.data[i]);
                        }
                    }
                }
                for (let i=0; i<plusesArr.length; i++) {
                    let typeNameArr = [];
                    let typeArr = [];
                    for (let j=0; j<plusesArr[i].data.length; j++) {
                        let typeDic = plusesArr[i].data[j];
                        if (typeNameArr.indexOf(typeDic.deptTypeName) === -1) {
                            typeNameArr.push(typeDic.deptTypeName);
                            typeArr.push({title: typeDic.deptTypeName, data: []})
                        }
                    }

                    for (let j=0; j<plusesArr[i].data.length; j++) {
                        for (let k=0; k<typeArr.length; k++) {
                            if (plusesArr[i].data[j].deptTypeName === typeArr[k].title) {
                                typeArr[k].data.push(plusesArr[i].data[j]);
                            }
                        }
                    }
                    plusesArr[i].data = typeArr;
                }
                this.setState({
                    data: plusesArr,
                });
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }
    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <SectionList
                    ref="_sectionList"
                    renderItem={({item, index}) => this._renderItem(item, index)}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
                />
                <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                    width:screenWidth-16*unitWidth,}} onPress={this._onSave.bind(this)}>
                    <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                        alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                        {'保存'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    // 分组列表的头部
    _renderSectionHeader = (sectionItem) => {
        const {section} = sectionItem;
        return (
            <View style={{backgroundColor:'#F4F4F4', height: 30 * unitHeight, justifyContent: 'center',
                paddingLeft: 10 * unitWidth}}>
                <Text style={{fontSize: 17*unitWidth, fontWeight: 'bold'}}>{section.title}</Text>
            </View>
        );
    };
    _renderItem = (item, index) => {
        return (
            <View>
                <Text
                    numberOfLines={0}
                    style={{fontSize: 15*unitWidth, marginTop: 5*unitWidth, marginLeft: 20*unitWidth,
                        fontWeight: 'bold'}}>
                    {item.title}
                </Text>
                {
                    item.data.map((i)=>{
                        return (
                            <View style={{marginLeft: 30*unitWidth}}>
                                <TextInputWidget  value={i.score.toString()}  title={i.deptName}  placeholder='请输入分数' onChangeText={(text)=>{
                                    const newText = text.replace(/[^\d]+/, '');
                                    if (newText > i.pluses.maxScore || newText < i.pluses.minScore) {
                                        RRCToast.show('分值有误，请重新输入...');
                                        i.score = '';
                                    } else {
                                        i.score = newText;
                                    }
                                    this.setState({data: this.state.data});
                                }}/>
                            </View>
                        )
                    })
                }
            </View>
        )
    };
    _onSave = () => {
        let arr = this.state.data;
        let postArr = [];
        for (let i=0; i<arr.length; i++) {
            let pluses = arr[i];
            for (let j=0; j<pluses.data.length; j++) {
                let type = pluses.data[j];
                postArr = postArr.concat(type.data);
            }
        }
        HttpPost(URLS.SaveDeptSetup, postArr,'正在保存...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1) {
                this.props.navigation.goBack();
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }
}
