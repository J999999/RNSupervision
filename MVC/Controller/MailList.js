import React, {Component} from "react";
import {View, Text, Dimensions, SectionList, FlatList, TouchableOpacity, StyleSheet, Image, Linking} from 'react-native';
import pinyin from 'pinyin';
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {HttpPost} from "../Tools/JQFetch";
import URLS from "../Tools/InterfaceApi";

export default class MailList extends Component {

    static navigationOptions = {
        headerTitle: '通讯录',
        headerLeft: null,
    };

    constructor() {
        super();
        this.state = {
            sections: [],       //section数组
            letterArr: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],      //首字母数组
            showIndex: -1
        };
    }


    componentWillMount() {

        HttpPost(URLS.MailList,{}, '正在加载...').then((response)=>{
            if (response.result !== 1){
                RRCToast.show(response.msg);
            }
            // 暂时静态数据替换
            //获取联系人列表
            let list = response.data.records;
            let sections = [], letterArr = [];
            // 右侧字母栏数据处理
            list.map((item, index) => {
                if (item.name){
                    letterArr.push(pinyin(item.name.substring(0, 1), {
                        style: pinyin.STYLE_FIRST_LETTER,
                    })[0][0].toUpperCase());
                }

                letterArr = [...new Set(letterArr)].sort();

                this.setState({letterArr: letterArr})
            });
            // 分组数据处理
            letterArr.map((item, index) => {
                sections.push({
                    title: item,
                    data: []
                })
            });
            list.map(item => {
                let listItem = item;
                sections.map(item => {
                    if (listItem.name) {
                        let first = listItem.name.substring(0, 1);
                        let test = pinyin(first, {style: pinyin.STYLE_FIRST_LETTER})[0][0].toUpperCase();
                        if (item.title === test) {
                            item.data.push({firstName: first, name: listItem.name, imagePath:listItem.imagePath,
                                telephone: listItem.telephone});
                        }
                    }
                })
            });
            this.setState({sections: sections})
        });
    }

    // 字母关联分组跳转
    _onSectionselect = (key) => {

        this.refs._sectionList.scrollToLocation({
            itemIndex: 0,
            sectionIndex: key,
            viewOffset: 20,
        })

    };

    // 分组列表的头部
    _renderSectionHeader(sectionItem) {
        const {section} = sectionItem;
        return (
            <View style={styles.sectionHeaderStyle}>
                <Text style={{fontSize: 17*unitWidth, fontWeight: 'bold'}}>{section.title.toUpperCase()}</Text>
            </View>
        );
    }

    _callback = (item, index) =>{
        if (item.telephone){
            let identifier = '';
            index === 0? identifier = 'tel:':identifier = 'sms:';
            let url = identifier + item.telephone;
            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    console.log('Can\'t handle url: ' + url);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        } else {
            RRCToast.show('无电话号码...');
        }
    };

    // 分组列表的renderItem
    _renderItem(item, index) {
        const {showIndex} = this.state;
        return (
            <TouchableOpacity
                activeOpacity={.75}
                onPress={() => {
                    this.setState({
                        showIndex: item.name,
                    });
                    RRCAlert.alert('请选择','', [
                        {text:'打电话', style:{color:'#38ADFF', fontWeight: 'bold'}},
                        {text:'发信息', style:{color:'#38ADFF', fontWeight: 'bold'}},
                        {text: '取消', style: {color: '#38ADFF', fontWeight: 'bold'}},
                    ], this._callback.bind(this, item));
                }}
            >
                <View style={styles.itemStyle}>
                    {
                        item.imagePath?<Image source={require('../Images/main_me0.png')}
                                              style={{
                                                  height: 34*unitWidth,
                                                  width: 34*unitWidth,
                                                  marginLeft: 10*unitWidth}}/>:
                            <View style={{
                                height: 34*unitWidth,
                                width: 34*unitWidth,
                                marginLeft: 10*unitWidth,
                                alignItems:'center',
                                justifyContent:'center',
                                backgroundColor: '#38ADFF',
                                borderRadius: 5*unitWidth}}>
                                <Text style={{
                                    fontSize: 20*unitWidth,
                                    color: '#fff'}}>{item.firstName}</Text>
                            </View>
                    }
                    <View style={{marginLeft: 10*unitWidth}}>
                        <Text style={{fontSize: 17*unitWidth, margin: 3*unitWidth}}>{item.name}</Text>
                        {item.telephone?<Text style={{fontSize: 14*unitWidth,margin: 3*unitWidth}}>{item.telephone}</Text>:null}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <View style={styles.contain}>
                <SectionList
                    ref="_sectionList"
                    renderItem={({item, index}) => this._renderItem(item, index)}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={this.state.sections}
                    keyExtractor={(item, index) => item + index}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 54*unitWidth}}/>}
                />

                {/*右侧字母栏*/}
                <View style={{position: 'absolute', right: 5*unitWidth}}>
                    <FlatList
                        contentContainerStyle={styles.flatStyle}
                        data={this.state.letterArr}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) =>
                            <TouchableOpacity
                                onPress={() => {
                                    this._onSectionselect(index)
                                }}
                            >
                                <Text>{item.toUpperCase()}</Text>
                            </TouchableOpacity>
                        }
                    />
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    contain: {
        flex: 1,
        flexDirection: 'row',
    },
    flatStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height:654*unitHeight
    },
    sectionHeaderStyle: {
        backgroundColor:'#F4F4F4',
        height: 30 * unitHeight,
        justifyContent: 'center',
        paddingLeft: 10 * unitWidth
    },
    itemStyle:{
        height: 54 * unitHeight,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
