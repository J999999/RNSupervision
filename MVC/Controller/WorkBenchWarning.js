import React from 'react';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from 'react-native-overlayer/src';
import {
    View,
    StyleSheet,
    Text,
    ScrollView, Image,
} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';

import {Table, TableWrapper} from '../View/Table/table';
import {Row, Rows} from '../View/Table/rows';
import {Col} from '../View/Table/cols';
import Bar from '../View/Table/Bar';
var navigation = null;
var context ;
/**
 * 预警信息
 */
export default class WorkBenchWarning extends React.Component {

    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        context = this;
        this.colors = [
            '#333333',
            '#426ac7',
            '#fe7500',
            '#aaaaaa',
            '#ffc200',
        ];

        this.state = {
            tableHead: ['单位名称', '已完成', '正常推进', '临期','逾期'],
            tableTitle: [],
            tableData: [],

            loaded:false,

            sourceData :{
                name:'',
                legend:{},
                xAxis:{
                    name: '',
                    lineStyle: {//轴线相关配置
                        color: this.colors[0]
                    },
                    axisTick: {//刻度相关配置
                        show: true,
                        lineStyle: {
                            color: this.colors[0]
                        }
                    },
                    textStyle: {
                        color: this.colors[0]
                    },
                    data: [ '已完成', '正常推进', '临期','逾期','总数量']
                },
                yAxis:{
                    name: 'ertt',
                    lineStyle: {
                        color: this.colors[0]
                    },
                    axisTick: {
                        show: true,
                        lineStyle: {
                            color: this.colors[0]
                        }
                    },
                    textStyle: {
                        color: this.colors[0]
                    },
                    gridLine: {
                        show: true,
                        lineStyle: {
                            color: this.colors[0]
                        }
                    },
                    min: 0,
                    max: 5,
                    interval: 1
                },
                series:[ ]
            }
        }

    }

    componentDidMount() {
        const {params} =  navigation.state
        this.getStaticsInfo()
    }

    getStaticsInfo(){

        HttpPost(URLS.StatisticsWorkbenchProject,{},"正在加载").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                if(response.data==null || response.data ==[]){
                    return
                }
                this.setData(response.data)

            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    setData(data){
        let finalData = []
        let tableTitle = data.labelList
        let tableData = []

        for(let i in data.labelList){
            let item = []
            item.push(data.doneNumList[i])
            item.push(data.normalNumList[i])
            item.push(data.onScheduleNumList[i])
            item.push(data.overdueNumList[i])
            tableData.push(item)
        }

        let tempdata = this.state.sourceData

        let max =  this.getMaxValue(data)
        let min = 0

        let interval = max<=5 ? 1 :Math.floor((max-min)/5)

        tempdata.yAxis.min = min
        tempdata.yAxis.max = max
        tempdata.yAxis.interval = interval

        let tempseries = []
        let ser = {}
        let style = {}
        let dataArr=[]


        dataArr.push(data.respUnitList[0].doneNum)
        dataArr.push(data.respUnitList[0].normalNum)
        dataArr.push(data.respUnitList[0].onScheduleNum)
        dataArr.push(data.respUnitList[0].overdueNum)
        dataArr.push(data.respUnitList[0].underTakeNum)


        ser['data'] = dataArr
        style['color'] = this.colors[1]
        ser['itemStyle']= style

        tempseries.push(ser)

        tempdata['series']= tempseries

        console.log( tempdata )
        this.setState({
            loaded:true,
            sourceData:tempdata,
            tableTitle:tableTitle,
            tableData:tableData,
        })
    }

    getMaxValue(data){
        let max = Math.max.apply(null, data.respUnitList.underTakeNum)
        if(max<5){
            max = 5
        }
        while(max % 5!=0){
            max++
        }
        return max
    }

    static  navigationOptions = ({navigation}) =>({
        title: '预警信息',
    });

    render() {
        const state = this.state;
        return (
            <View style={styles.container}>
                {this.state.loaded && <View
                    style={{
                        flex: 1,
                        marginBottom:8
                    }}
                    contentContainerStyle={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                    <Bar option={this.state.sourceData} height={330} />
                </View>}
                <View style={{flex:1,paddingLeft:16,paddingRight:16}}>
                    <Table borderStyle={{borderWidth: 1}}>
                        <Row data={state.tableHead} flexArr={[1, 1, 1, 1,1]} style={styles.head} textStyle={styles.text}/>
                        <TableWrapper style={styles.wrapper}>
                            <Col data={state.tableTitle} style={styles.title} heightArr={[40,40]} textStyle={styles.text}/>
                            <Rows data={state.tableData} flexArr={[1, 1, 1,1]} style={styles.row} textStyle={styles.text}/>
                        </TableWrapper>
                    </Table>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({

    container: { flex: 1, padding: 10,  backgroundColor: '#fff' },
    head: { height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { textAlign: 'center' }


});

