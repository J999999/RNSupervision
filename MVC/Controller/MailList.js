import React, {Component} from "react";
import {View, Text, Dimensions, SectionList, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import pinyin from 'pinyin';
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import {RRCToast} from "react-native-overlayer/src";

let testData = [
    {name: '盖伦'},
    {name: '崔丝塔娜'},
    {name: "大发明家"},
    {name: "武器大师", imagePath:'eee'},
    {name: '刀妹'},
    {name: "卡特琳娜"},
    {name: '盲僧'},
    {name: "蕾欧娜"},
    {name: "拉克丝", imagePath:'222'},
    {name: "剑圣"},
    {name: "赏金"},
    {name: "发条"},
    {name: "瑞雯"},
    {name: "提莫", imagePath:'3333'},
    {name: "卡牌"},
    {name: "剑豪"},
    {name: "琴女"},
    {name: "木木"},
    {name: "雪人"},
    {name: "安妮"},
    {name: "薇恩"},
    {name: "小法师"},
    {name: "艾尼维亚"},
    {name: "奥瑞利安索尔"},
    {name: "布兰德"},
    {name: "凯特琳"},
    {name: "虚空"},
    {name: "机器人"},
    {name: "挖掘机"},
    {name: "EZ"},
    {name: "暴走萝莉"},
    {name: "艾克"},
    {name: "波比"},
    {name: "赵信"},
    {name: "牛头"},
    {name: "九尾"},
    {name: "菲兹"},
    {name: "寒冰"},
    {name: "猴子"},
    {name: "深渊"},
    {name: "凯南"},
    {name: "诺克萨斯"},
    {name: "祖安"},
    {name: "德莱文"},
    {name: "德玛西亚王子"},
    {name: "豹女"},
    {name: "皮城执法官"},
    {name: "泽拉斯"},
    {name: "岩雀"},
];


export default class MailList extends Component {

    static navigationOptions = {
        title: '通讯录',
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
        // 暂时静态数据替换
        //获取联系人列表
        let list = testData;
        let sections = [], letterArr = [];
        // 右侧字母栏数据处理
        list.map((item, index) => {
            letterArr.push(pinyin(item.name.substring(0, 1), {
                style: pinyin.STYLE_FIRST_LETTER,
            })[0][0].toUpperCase());

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
                let first = listItem.name.substring(0, 1);
                let test = pinyin(first, {style: pinyin.STYLE_FIRST_LETTER})[0][0].toUpperCase();
                if (item.title == test) {
                    item.data.push({firstName: first, name: listItem.name, imagePath:listItem.imagePath});
                }
            })
        });
        this.setState({sections: sections})

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
                        <Text style={{fontSize: 16*unitWidth}}>{item.name}</Text>
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
                    ItemSeparatorComponent={() =>  <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 54*unitWidth}}/>}
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
        height: 44 * unitHeight,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
