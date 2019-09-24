import React from 'react';
import {View, SectionList, Text, TouchableOpacity} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";

export default class DetailedListInformation extends React.Component{
    static navigationOptions = {
        title: '主体责任清单'
    };

    constructor (){
        super ();
        this.state = {
            data: [],
        }
    }

    componentDidMount(): void {
        HttpPost(URLS.QueryPartyInfoByParam, {}, '正在加载...').then((response)=>{
            let stateArr = [];
            let a = {};
            let b = {};
            let c = {};
            let d = {};
            a['title'] = '乡镇（街道、管委会）';
            a['data'] = response['data']['villagesAndTownsParty'];
            b['title'] = '市直单位';
            b['data'] = response['data']['straightUnitParty'];
            c['title'] = '垂直单位';
            c['data'] = response['data']['verticalUnitParty'];
            d['title'] = '企业学校';
            d['data'] = response['data']['businessSchoolParty'];
            stateArr.push(a);
            stateArr.push(b);
            stateArr.push(c);
            stateArr.push(d);
            this.setState({data: stateArr});
        })
    }
    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <SectionList
                    extraData={this.state}
                    sections={this.state.data}
                    keyExtractor={(item, index) => item + index}
                    renderSectionHeader={this._renderSectionHeader}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() =>
                        <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 20*unitWidth}}/>}
                />
            </View>
        )
    }
    _renderSectionHeader = (sectionItem) => {
        const {section} = sectionItem;
        return(
            <View style={{backgroundColor:'#F4F4F4', height: 30 * unitHeight, justifyContent: 'center', paddingLeft: 10 * unitWidth}}>
                <Text style={{fontSize: 17*unitWidth, fontWeight: 'bold'}}>{section.title}</Text>
            </View>
        )
    };
    _renderItem = ({item}) => {
        return(
            <TouchableOpacity activeOpacity={.5} onPress={this._clickAction.bind(this, item)}>
                <View style={{height: 44*unitWidth, justifyContent: 'center', paddingLeft: 20*unitWidth}}>
                    <Text>{item.deptName}</Text>
                </View>
            </TouchableOpacity>
        )
    };
    _clickAction = (item) => {
        this.props.navigation.navigate('DetailedList', {deptId: item.id})
    }
}
