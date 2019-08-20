import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import ExpandableList from 'react-native-expandable-section-flatlist';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";

const workbenchData = [
    {
        title: '办公OA',
        imagePath: require('../Images/testIcon/tdkc.png'),
        member: [
            {
                title: '通知公告',
                imagePath: require('../Images/testIcon/wdkh.png')
            },
            {
                title: '短信群发',
                imagePath: require('../Images/testIcon/wdskd.png')
            },
        ]
    },
    {
        title: '工作督查',
        imagePath: require('../Images/testIcon/xtbg.png'),
        member: [
            {
                title: '意见审核',
                imagePath: require('../Images/testIcon/visit.png')
            },
            {
                title: '立项交办',
                imagePath: require('../Images/testIcon/wdshd.png')
            },
            {
                title: '工作汇报',
                imagePath: require('../Images/testIcon/wdxxfk.png')
            },
        ]
    },
    {
        title: '效能问责',
        imagePath: require('../Images/testIcon/xsddgl.png'),
        member: [
            {
                title: '约谈事项',
                imagePath: require('../Images/testIcon/yskcx.png'),
            },
        ]
    },
];

export default class Function extends React.Component {
    static navigationOptions = {
        title: '功能',
        headerLeft: null,
    };
    _renderRow = (rowItem, rowId, sectionId) => (
        <TouchableOpacity key={rowId} onPress={() => {}}>
            <View>
                <View style={{height: 44*unitHeight, flexDirection:'row', alignItems: 'center'}}>
                    <Image source={rowItem.imagePath}
                           style={{width: 30*unitWidth, height: 30*unitWidth, marginLeft: 40*unitWidth}}/>
                    <Text style={{marginLeft: 15*unitWidth, fontSize: 14*unitWidth}}>{rowItem.title}</Text>
                </View>
                <View style={{height: unitHeight, marginLeft: 85*unitWidth, backgroundColor:'#F4F4F4'}}/>
            </View>
        </TouchableOpacity>
    );
    _renderSection = (section, sectionId)  => {
        return (
            <View style={{height: 64*unitHeight, borderBottomWidth: unitHeight, flexDirection:'row',
                alignItems: 'center', borderBottomColor: '#F4F4F4', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={workbenchData[sectionId]['imagePath']}
                           style={{width: 45*unitWidth, height: 45*unitWidth, marginLeft: 20*unitWidth}}/>
                    <Text style={{marginLeft: 15*unitWidth, fontSize: 16*unitWidth}}>{section}</Text>
                </View>
                <Image source={require('../Images/goRight.png')}
                       style={{width: 10*unitWidth, height: 10*unitWidth, marginRight: 10*unitWidth}}/>
            </View>
        );
    };
    render() {
        return (
            <View style={{flex: 1}}>
                <ExpandableList
                    dataSource={workbenchData}
                    ref={instance => this.ExpandableList = instance}
                    headerKey={'title'}
                    memberKey={'member'}
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0]}
                    rowNumberCloseMode={0}
                />
            </View>
        );
    }
}
