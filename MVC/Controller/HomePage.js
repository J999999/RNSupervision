import React from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image} from 'react-native';
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";
import {HttpGet, HttpPost} from "../Tools/JQFetch";
import URLS from "../Tools/InterfaceApi";
import AsyncStorage from '@react-native-community/async-storage'

const {width, height} = Dimensions.get('window');
const cols = 3;
const vMargin = 20;
const cellWH = (width-vMargin-120)/cols;
const hMargin = 25;

export default class HomePage extends React.Component {

    componentDidMount(): void {
        HttpGet(URLS.UserMenu, '正在加载...').then((response)=>{
            if (response.result !== 1) {
                RRCToast.show(response.msg);
            }else {
                AsyncStorage.setItem('userMenu',JSON.stringify(response.data));
                let functions = [];
                for (let i = 0; i < response.data.length; i++){
                    let oneLevel = response.data[i];
                    for (let j = 0; j < oneLevel.children.length; j++){
                        let twoLevel = oneLevel.children[j];
                        functions.push(twoLevel);
                    }
                }
                functions.push({'name':'添加功能'});
                this.setState({
                    data: functions,
                })
            }
        })
    }

    constructor(props){
        super(props);
        this.state = {
            data:[]
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index}
                    contentContainerStyle={styles.list_container}
                    numColumns={cols}
                />
            </View>
        );
    }
    renderItem({item, index})  {
        return (
            <TouchableOpacity activeOpacity={.75} onPress={()=>{this._ClickItemAction(item)}}>
                {index===this.state.data.length-1?<View style={styles.item}>
                    <Image source={require('../Images/addIcon.png')}
                           style={{width: 80*unitWidth, height: 80*unitWidth, borderRadius: 5}}/>
                </View>:<View style={styles.item}>
                    <Image source={require('../Images/testIcon/xxfk.png')}
                           style={{width: 60 * unitWidth,height:60 * unitWidth, borderRadius: 5}}/>
                    <Text style={{marginTop: 15, textAlign: 'center'}}
                          numberOfLines={1}>{item.name}</Text>
                </View>}
            </TouchableOpacity>
        )
    }
    _ClickItemAction(item){
        switch (item.id) {
            case 8:
                RRCToast.show(item.name);
                break;
            case 9:
                RRCToast.show(item.name);
                break;

            default:
                this.props.navigation.navigate('AddFunction');
        }
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
    },
    item: {
        width: 105*unitWidth,
        height: 105*unitWidth,
        marginTop: hMargin,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: 'red',
        marginLeft: 15*unitWidth,
    },
});
