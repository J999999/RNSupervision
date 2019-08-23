import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import ExpandableList from 'react-native-expandable-section-flatlist';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import AsyncStorage from '@react-native-community/async-storage'

export default class Function extends React.Component {

    constructor(){
        super();
        this.state = {
            data:[],
        };
    }

    componentDidMount(): void {
        AsyncStorage.getItem('userMenu').then((value) => {
            this.setState({
                data: JSON.parse(value),
            })
        });
    }

    _renderRow = (rowItem, rowId, sectionId) => (
        <TouchableOpacity key={rowId}
                          onPress={() => {}}>
            <View>
                <View style={{height: 44*unitHeight, flexDirection:'row', alignItems: 'center'}}>
                    <Image source={require('../Images/testIcon/xsddgl.png')}
                           style={{width: 30*unitWidth, height: 30*unitWidth, marginLeft: 60*unitWidth}}/>
                    <Text style={{marginLeft: 15*unitWidth, fontSize: 14*unitWidth}}>{rowItem.name}</Text>
                </View>
                <View style={{height: unitHeight, marginLeft: 100*unitWidth, backgroundColor:'#F4F4F4'}}/>
            </View>
        </TouchableOpacity>
    );
    _renderSection = (section, sectionId)  => {
        return (
            <View style={{height: 64*unitHeight, borderBottomWidth: unitHeight, flexDirection:'row',
                alignItems: 'center', borderBottomColor: '#F4F4F4', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={require('../Images/testIcon/wdshd.png')}
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
                    dataSource={this.state.data}
                    ref={instance => this.ExpandableList = instance}
                    headerKey={'name'}
                    memberKey={'children'}
                    renderRow={this._renderRow}
                    renderSectionHeaderX={this._renderSection}
                    openOptions={[0]}
                    rowNumberCloseMode={0}
                />
            </View>
        );
    }
}
