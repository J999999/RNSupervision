import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image} from 'react-native';
import {HttpGet} from "../Tools/JQFetch";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";

const {width, height} = Dimensions.get('window');
const cols = 3;
const vMargin = 20;
const cellWH = (width-vMargin-120)/cols;
const hMargin = 25;

export default class Home extends React.Component {
    static navigationOptions = {
        title: '首页',
        headerLeft: null,
    };
    constructor(props){
        super(props);
        this.state = {
            data:[
                {title:'通知公告',image:require('../Images/testIcon/xsddgl.png')},
                {title:'短信群发',image:require('../Images/testIcon/xsddtj.png')},
                {title:'意见审核',image:require('../Images/testIcon/xsgl.png')},
                {title:'立项交办',image:require('../Images/testIcon/xssptj.png')},
                {title:'工作汇报',image:require('../Images/testIcon/xtbg.png')},
                {title:'督查统计',image:require('../Images/testIcon/xxfk.png')},
                {title:'约谈事项',image:require('../Images/testIcon/xxtz.png')},
                {title:'问责事项',image:require('../Images/testIcon/wdxxfk.png')},
                {title:'稽查约谈',image:require('../Images/testIcon/ydkc.png')},
                {title:'效能问责',image:require('../Images/testIcon/ydkccx.png')},
                {title:'效能审核',image:require('../Images/testIcon/yfkcx.png')},
                {title:'考核填报',image:require('../Images/testIcon/yjkgl.png')},
                {title:'填报审核',image:require('../Images/testIcon/wdysk.png')},
                {title:'成绩预览和发布',image:require('../Images/testIcon/zyfkxx.png')},
                {title:'考核成绩查看',image:require('../Images/testIcon/thgl.png')},
                {title:'党组织信息完善',image:require('../Images/testIcon/tdkc.png')},
                {title:'主体责任清单编辑',image:require('../Images/testIcon/visit.png')},
                {title:'主体责任落实情况',image:require('../Images/testIcon/wdkh.png')},
                {title:'巡查整改完成情况',image:require('../Images/testIcon/wdysk.png')},
                {title:'经验交流',image:require('../Images/testIcon/wdshd.png')},
                {title:'工作审核',image:require('../Images/testIcon/wdskd.png')},
                {title:'添加功能',image:require('../Images/testIcon/wdskd.png')},
            ]
        };
    }
    componentDidMount(): void {

    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index}
                    contentContainerStyle={styles.list_container}
                />
            </View>
        );
    }
    renderItem({item, index})  {
        return (
            <TouchableOpacity activeOpacity={.75}>
                <View style={styles.item}>
                    <Image source={item.image}
                           style={{width: 60 * unitWidth,height:60 * unitWidth, borderRadius: 5}}/>
                    <Text style={{marginTop: 15, textAlign: 'center'}}
                          numberOfLines={1}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    fetchData() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list_container: {
        // 主轴方向
        flexDirection:'row',
        // 一行显示不下,换一行
        flexWrap:'wrap',
        // 侧轴方向
        alignItems:'center', // 必须设置,否则换行不起作用
        //paddingHorizontal: 50 * unitWidth,
    },
    item: {
        width:105*unitWidth,
        marginTop:hMargin,
        alignItems: 'center',
        //backgroundColor: 'red',
        marginLeft: 15*unitWidth,
    },
});
