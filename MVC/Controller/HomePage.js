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

    async componentDidMount(): void {
        const xx = await AsyncStorage.getItem('homePageFunc');
        // console.log(JSON.stringify(xx));
        if (xx) {
            this.setState({
                data: JSON.parse(xx),
            })
        } else {
            this._getFunctionAction();
        }
    }
    _getFunctionAction(){
        let functions = [];
        HttpPost(URLS.UserMenu, {},'正在加载...').then((response)=>{
            if (response.result !== 1) {
                RRCToast.show(response.msg);
            }else {
                AsyncStorage.setItem('userMenu',JSON.stringify(response.data));
                for (let i = 0; i < response.data.length; i++){
                    let oneLevel = response.data[i];
                    for (let j = 0; j < oneLevel.children.length; j++){
                        let twoLevel = oneLevel.children[j];
                        functions.push(twoLevel);
                    }
                }
                //展示在首页的功能数组,获取之后保存在本地(添加删除功能对 homePageFunc 进行操作)
                functions.push({'name':'添加功能'});
                AsyncStorage.setItem('homePageFunc', JSON.stringify(functions));
                this.setState({
                    data: functions,
                })
            }
        });
    }
    constructor(props){
        super(props);
        this.state = {
            data:[],
            deleteBtnHidden: false,
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    extraData={this.state}
                    data={this.state.data}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => index}
                    //contentContainerStyle={styles.list_container}
                    numColumns={cols}
                />
            </View>
        );
    }
    renderItem({item, index})  {
        return (
            <TouchableOpacity activeOpacity={.75}
                              onPress={()=>{this._ClickItemAction(item)}}
                              onLongPress={()=>{this.setState({deleteBtnHidden: !this.state.deleteBtnHidden})}}>
                {index===this.state.data.length-1?<View style={styles.item}>
                    <Image source={require('../Images/addIcon.png')}
                           style={{width: 70*unitWidth, height: 70*unitWidth, borderRadius: 5,
                               marginTop: 15*unitWidth, marginLeft: 15*unitWidth}}/>
                </View>:<View style={styles.item}>
                    <TouchableOpacity activeOpacity={.75}
                                      onPress={()=>{this._deleteFuncAction(item)}}>
                        {this.state.deleteBtnHidden === true?<Image source={require('../Images/deleteicon.png')}
                                                                    style={{width: 20*unitWidth, height: 20*unitWidth, marginLeft: 85*unitWidth}}/>:null}
                    </TouchableOpacity>
                    <Image source={require('../Images/testIcon/xxfk.png')}
                           style={{width: 60 * unitWidth,height:60 * unitWidth, borderRadius: 5, marginLeft: 20*unitWidth}}/>
                    <Text style={{marginTop: 15, textAlign: 'center'}}
                          numberOfLines={0}>{item.name}</Text>
                </View>}
            </TouchableOpacity>
        )
    }
    _deleteFuncAction(item){
        let homeFuncs = [];
        homeFuncs = homeFuncs.concat(this.state.data);
        for (let i=0; i<homeFuncs.length; i++){
            if (homeFuncs[i].id === item.id){
                homeFuncs.splice(i,1);
            }
        }
        AsyncStorage.setItem('homePageFunc', JSON.stringify(homeFuncs));
        this.setState({
            data: homeFuncs,
        })
    }
    /**
     * 8.通知公告 9.短信群发 12.意见审批 15.督查统计 23.考核成绩展示 27.效能审核 31.经验交流 82.主题责任清单
     * 83.主体责任落实情况 84.巡查整改完成情况 45.资料云盘...............
     */
    _ClickItemAction(item){
        switch (item.id) {
            case 8:
                break;
            case 9:
                break;
            case 25:

                break;
            case 27:
                //督查约谈
                this.props.navigation.navigate('IInterviewList');
                break;
            default:
                this.props.navigation.navigate('AddFunction',{
                    refresh: (homeFuncs) => {
                        this.setState({
                            data: homeFuncs,
                        })
            },
                });
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
        //justifyContent: 'center',
        //alignItems: 'center',
        marginLeft: 15*unitWidth,
    },
});
