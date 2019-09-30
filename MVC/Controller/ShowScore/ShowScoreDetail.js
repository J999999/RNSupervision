import React from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {screenHeight, screenWidth, unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";

export default class ShowScoreDetail extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '成绩详情',
    });

    constructor () {
        super ();
        this.state = {
            data: {},
            typeList: [],
            KHTypeList: [],
            scoreList: [],
        }
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});

        let id = this.props.navigation.getParam('item').id;
        HttpPost(URLS.ShowScoreDetail,{id: id}, '正在加载...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                //排序
                let sortArr = response.data.deptScoreList;
                for (let i=0; i<sortArr.length - 1; i++) {
                    for (let j=i+1; j<sortArr.length; j++) {
                        if (sortArr[i].rank > sortArr[j].rank) {
                            let temp = [];
                            temp = sortArr[i];
                            sortArr[i] = sortArr[j];
                            sortArr[j] = temp;
                        }
                    }
                }
                //考核类别
                let KHTypeNameArr = [];
                let KHTypeArr = [];
                for (let i=0; i<sortArr.length; i++) {
                    for (let j=0; j<sortArr[i].deptAssessTypeScoreList.length; j++) {
                        if (KHTypeNameArr.indexOf(sortArr[i].deptAssessTypeScoreList[j].assessTypeName) === -1) {
                            KHTypeNameArr.push(sortArr[i].deptAssessTypeScoreList[j].assessTypeName);
                            KHTypeArr.push({
                                title: sortArr[i].deptAssessTypeScoreList[j].assessTypeName,
                                data: [],
                            })
                        }
                    }
                }
                //考核指标名
                for (let i=0; i<sortArr.length; i++) {
                    for (let j=0; j< sortArr[i].deptAssessTypeScoreList.length; j++) {
                        let jDic = sortArr[i].deptAssessTypeScoreList[j];
                        for (let k=0; k<KHTypeArr.length; k++) {
                            if (jDic.assessTypeName === KHTypeArr[k].title) {
                                for (let l=0; l<jDic.deptIndicatorScoreList.length; l++) {
                                    if (KHTypeArr[k].data.indexOf(jDic.deptIndicatorScoreList[l].indicatorName) === -1) {
                                        KHTypeArr[k].data.push(jDic.deptIndicatorScoreList[l].indicatorName)
                                    }
                                }
                            }
                        }
                    }
                }

                let typeNameArr = [];
                let typeArr = [];
                for (let i=0; i<sortArr.length; i++) {
                    let ii = sortArr[i];
                    if (typeNameArr.indexOf(ii.deptTypeName) === -1) {
                        typeNameArr.push(ii.deptTypeName);
                        typeArr.push({title:ii.deptTypeName, data:[]});
                    }
                }
                for (let i=0; i<sortArr.length; i++) {
                    let ii = sortArr[i];
                    for (let j=0; j<typeArr.length; j++){
                        if (typeArr[j].title === ii.deptTypeName) {
                            typeArr[j].data.push(ii);
                        }
                    }
                }

                typeArr.map((i)=>{
                    i.data.map((j)=>{
                        let typeNameArr = [];
                        j.deptAssessTypeScoreList.map((k)=>{
                            typeNameArr.push(k.assessTypeName);
                        });
                        KHTypeNameArr.map((l)=>{
                            if (typeNameArr.indexOf(l) === -1) {
                                j.deptAssessTypeScoreList.push({
                                    assessTypeName: l,
                                    score: '-',
                                    rank: '-',
                                    deptIndicatorScoreList: [],
                                })
                            }
                        })
                    })
                });

                typeArr.map((i)=>{
                    i.data.map((j)=>{
                        j.deptAssessTypeScoreList.map((k)=>{
                            let nameArr = [];
                            k.deptIndicatorScoreList.map((l)=>{
                                nameArr.push(l.indicatorName);
                            });
                            KHTypeArr.map((m)=>{
                                if (m.title === k.assessTypeName) {
                                    m.data.map((n)=>{
                                        if (nameArr.indexOf(n) === -1) {
                                            k.deptIndicatorScoreList.push({
                                                indicatorName: n,
                                                score: '-',
                                            })
                                        }
                                    })
                                }
                            })
                        });
                    })
                });

                typeArr.map((i)=>{
                    i.data.map((j)=>{
                        let typeNameArr = [];
                        KHTypeArr.map((l)=>{
                            j.deptAssessTypeScoreList.map((k)=>{
                                if (l.title === k.assessTypeName) {
                                    typeNameArr.push(k);
                                }
                            });

                        });
                        j.deptAssessTypeScoreList = [];
                        j.deptAssessTypeScoreList = typeNameArr;
                    })
                });

                //加分项
                let scoreName = [];
                for (let i=0; i<sortArr.length; i++) {
                    if (sortArr[i].deptPlusesScoreList) {
                        for (let j=0; j<sortArr[i].deptPlusesScoreList.length; j++) {
                            let dic = sortArr[i].deptPlusesScoreList[j];
                            if (scoreName.indexOf(dic.plusesName) === -1) {
                                scoreName.push(dic.plusesName);
                            }
                        }
                    }
                }
                this.setState({
                    data : response.data,
                    typeList: typeArr,
                    KHTypeList: KHTypeArr,
                    scoreList: scoreName,
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('系统内部错误')
        })
    }
    render(): React.ReactNode {
        let data = this.state.data;
        let publishState = this.props.navigation.getParam('item').publishState;
        return (
            <View style={{flex: 1}}>
                <Text
                    numberOfLines={0}
                    style={{
                        fontSize: 19*unitWidth, fontWeight: 'bold', textAlign: 'center', width: '100%',
                        marginTop: 10*unitWidth,
                    }}>
                    {data.tableName}
                </Text>
                <View style={{marginTop: 5*unitWidth, marginLeft: 5*unitWidth, height: 607*unitHeight}}>
                    <ScrollView contentContainerStyle={{width: 9999*unitWidth}}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={[styles.itemView, {height: 50*unitWidth, backgroundColor: '#F4F4F4', width: 180*unitWidth}]}>
                                <Text>类别</Text>
                            </View>
                            <View style={[styles.itemView, {height: 50*unitWidth, backgroundColor: '#F4F4F4', width: 180*unitWidth}]}>
                                <Text>单位</Text>
                            </View>
                            <View style={[styles.itemView, {height: 50*unitWidth, backgroundColor: '#F4F4F4', width: 50*unitWidth}]}>
                                <Text>排名</Text>
                            </View>
                            <View style={[styles.itemView, {height: 50*unitWidth, backgroundColor: '#F4F4F4', width: 60*unitWidth}]}>
                                <Text>总成绩</Text>
                            </View>
                            {
                                this.state.KHTypeList.map((i)=>{
                                    return (
                                        <View>
                                            <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4',
                                                width: 150*i.data.length*unitWidth+110*unitWidth}]}>
                                                <Text>{i.title}</Text>
                                            </View>
                                            <View style={{flexDirection: 'row'}}>
                                                {
                                                    i.data.map((j)=>{
                                                        return (
                                                            <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4',
                                                                width: 150*unitWidth}]}>
                                                                <Text>{j}</Text>
                                                            </View>
                                                        )
                                                    })
                                                }
                                                <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4',
                                                    width: 60*unitWidth}]}>
                                                    <Text>小计</Text>
                                                </View>
                                                <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4',
                                                    width: 50*unitWidth}]}>
                                                    <Text>排名</Text>
                                                </View>
                                            </View>

                                        </View>
                                    )
                                })
                            }
                            <View>
                                <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4', width: 150*this.state.scoreList.length*unitWidth}]}>
                                    <Text>加分事项</Text>
                                </View>
                                <View style={{flexDirection: 'row'}}>
                                    {
                                        this.state.scoreList.map((j)=>{
                                            return (
                                                <View style={[styles.itemView, {height: 25*unitWidth, backgroundColor: '#F4F4F4', width: 150*unitWidth}]}>
                                                    <Text>{j}</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                            </View>

                        </View>
                        {
                            this.state.typeList.map((i)=>{
                                return (
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={[styles.itemView, {height: i.data.length * 25*unitWidth, width: 180*unitWidth}]}>
                                                <Text>{i.title}</Text>
                                            </View>
                                            <View>
                                                {
                                                    i.data.map((j)=>{
                                                        return (
                                                            <View style={{flexDirection: 'row'}}>
                                                                <View style={[styles.itemView, {height: 25*unitWidth, width: 180*unitWidth}]}>
                                                                    <Text>{j.deptName}</Text>
                                                                </View>
                                                                <View style={[styles.itemView, {height: 25*unitWidth, width: 50*unitWidth}]}>
                                                                    <Text>{j.rank}</Text>
                                                                </View>
                                                                <View style={[styles.itemView, {height: 25*unitWidth, width: 60*unitWidth}]}>
                                                                    <Text>{j.score}</Text>
                                                                </View>
                                                                {
                                                                    j.deptAssessTypeScoreList.map((k)=>{
                                                                        return (
                                                                            <View style={{flexDirection: 'row'}}>
                                                                                {
                                                                                    this.state.KHTypeList.map((l)=>{

                                                                                        if (l.title === k.assessTypeName) {
                                                                                            if (l.data.length === k.deptIndicatorScoreList.length) {
                                                                                                return (
                                                                                                    <View style={{flexDirection: 'row'}}>
                                                                                                        {
                                                                                                            l.data.map((m)=>{
                                                                                                                return (
                                                                                                                    <View style={{flexDirection: 'row'}}>
                                                                                                                        {
                                                                                                                            k.deptIndicatorScoreList.map((n)=>{
                                                                                                                                if (n.indicatorName === m) {
                                                                                                                                    return (
                                                                                                                                        <View style={[styles.itemView, {height: 25*unitWidth, width: 150*unitWidth}]}>
                                                                                                                                            <Text>{n.score}</Text>
                                                                                                                                        </View>
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </View>
                                                                                                                )

                                                                                                            })
                                                                                                        }
                                                                                                    </View>
                                                                                                )
                                                                                            } else {
                                                                                                return (
                                                                                                    <View style={{flexDirection: 'row'}}>
                                                                                                        {
                                                                                                            l.data.map((m)=>{
                                                                                                                return (
                                                                                                                    <View style={{flexDirection: 'row'}}>
                                                                                                                        {
                                                                                                                            k.deptIndicatorScoreList.map((n)=>{
                                                                                                                                if (n.indicatorName === m) {
                                                                                                                                    return (
                                                                                                                                        <View style={[styles.itemView, {height: 25*unitWidth, width: 150*unitWidth}]}>
                                                                                                                                            <Text>{n.score}</Text>
                                                                                                                                        </View>
                                                                                                                                    )
                                                                                                                                } else {
                                                                                                                                    return (
                                                                                                                                        <View style={[styles.itemView, {height: 25*unitWidth, width: 150*unitWidth}]}>
                                                                                                                                            <Text>{'-'}</Text>
                                                                                                                                        </View>
                                                                                                                                    )
                                                                                                                                }
                                                                                                                            })
                                                                                                                        }
                                                                                                                    </View>
                                                                                                                )

                                                                                                            })
                                                                                                        }
                                                                                                    </View>
                                                                                                )
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                }
                                                                                <View style={[styles.itemView, {height: 25*unitWidth, width: 60*unitWidth}]}>
                                                                                    <Text>{k.score}</Text>
                                                                                </View>
                                                                                <View style={[styles.itemView, {height: 25*unitWidth, width: 50*unitWidth}]}>
                                                                                    <Text>{k.rank}</Text>
                                                                                </View>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                                {
                                                                    j.deptPlusesScoreList.map((k)=>{
                                                                        return (
                                                                            <View style={[styles.itemView, {height: 25*unitWidth, width: 150*unitWidth}]}>
                                                                                <Text>{k.score ? k.score : '-'}</Text>
                                                                            </View>
                                                                        )
                                                                    })
                                                                }
                                                            </View>
                                                        )
                                                    })
                                                }
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemView: {
        borderBottomWidth: 0.5*unitWidth,
        borderRightWidth: 0.5*unitWidth,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
