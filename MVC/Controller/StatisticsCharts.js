import React from 'react';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from 'react-native-overlayer/src';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    ScrollView, Image,
} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';

import {Table, TableWrapper} from '../View/Table/table';
import {Row, Rows} from '../View/Table/rows';
import {Col} from '../View/Table/cols';
import {unitWidth} from '../Tools/ScreenAdaptation';
import Bar from '../View/Table/Bar';
// import {ChartColors} from '../View/Theme';
/**
 * 统计图标
 */
export default class StatisticsCharts extends React.Component {

    constructor(props) {
        super(props);

        this.statisticUrl={
            '86':URLS.StatisticsUnit,//责任单位统计
            '87':URLS.StatisticsUser,//责任人
            '88':URLS.StatisticsProject,//重点项目统计
            '89':URLS.StatisticsProject,//决策部署统计
            '90':URLS.StatisticsProject,//领导批示统计
            '91':URLS.StatisticsProject,//两代表一委员”建议（议案）、提案统计
            '92':URLS.StatisticsProject,//政务督查统计
            '93':URLS.StatisticsProject,//民生实事统计
            '94':URLS.StatisticsProject,//其他工作统计
        }
        //事项分类：1-重点项目，2-领导批示，3-决策部署，4-政务督查，5-民生实事，6-两代表一委员建议（议案）、提案，7-其他工作
        this.projectType={
            '88':1,//重点项目统计
            '89':3,//决策部署统计
            '90':2,//领导批示统计
            '91':6,//两代表一委员”建议（议案）、提案统计
            '92':4,//政务督查统计
            '93':5,//民生实事统计
            '94':7,//其他工作统计
        }

        this.bean = null;
        this.colors = [
            '#c4ccd3',
            '#426ac7',
            '#fe7500',
            '#a5a5a5',
            '#ffc200',
        ];

        this.state = {
            isChart:false,
            tableHead: ['单位名称', '已完成', '正常推进', '临期','逾期'],
            tableTitle: [],
            tableData: [],

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
                    min: 0,
                    max: 20,
                    interval: 2,
                    data: [ ]
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
                    min: 1,
                    max: 10,
                    interval: 2
                },
                series:[ ]
            }
        }

     }

    rightClick=()=>{
        let state = !this.state.isChart
        this.setState({
            isChart:state,
        },()=>{
            this.props.navigation.setParams({
                isChart:state
            })
        })
    }


    componentDidMount() {

       this.props.navigation.setParams({rightClick:this.rightClick})
       this.props.navigation.setParams({isChart:this.state.isChart})

       const {params} =  this.props.navigation.state
       this.bean = params.bean

       this.getStaticsInfo()

     }

    getStaticsInfo(){
        let param={}
        if(this.bean.id>=88){
            param['projectType'] = this.projectType[this.bean.id]
        }
        HttpPost(this.statisticUrl[this.bean.id],param,"正在加载").then((response)=>{
            if(response.result == 1){
                if(response.data==null || response.data ==[] || response.data.labelList.length<1){
                    RRCToast.show(response.msg)
                    return
                }else{
                    this.setData(response.data)
                }
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

        if(this.bean.id == 87){
            for(let i in data.picList){
                let item = []
                let unit = data.picList[i]
                item.push(unit.doneNum)
                item.push(unit.normalNum)
                item.push(unit.onScheduleNum)
                item.push(unit.overdueNum)
                tableData.push(item)
            }
        }else {
            for(let i in data.respUnitList){
                let item = []
                let unit = data.respUnitList[i]
                item.push(unit.doneNum)
                item.push(unit.normalNum)
                item.push(unit.onScheduleNum)
                item.push(unit.overdueNum)
                tableData.push(item)
            }
        }


        let tempdata = this.state.sourceData

        tempdata.xAxis.data = data.labelList

        let max =  this.getMaxValue(data)
        let min =  this.getMinValue(data)

        let interval = max<=5 ? 1 :Math.floor((max-min)/5)

        tempdata.yAxis.min = min
        tempdata.yAxis.max = max
        tempdata.yAxis.interval = interval

        let tempseries = []
        for(let i = 0;i<4;i++){
            let ser = {}
            let style = {}

            switch (i) {
                case 0:
                    ser['data']= data.doneNumList
                    break;
                case 1:
                    ser['data']= data.normalNumList
                    break;
                case 2:
                    ser['data']= data.onScheduleNumList
                    break;
                case 3:
                    ser['data']= data.overdueNumList
                    break;
            }

            style['color'] = this.colors[i+1]
            ser['itemStyle']= style

            tempseries.push(ser)
        }

        tempdata['series']= tempseries

        // if(data.doneNumList!=null){
        //     let item = {}
        //     item['seriesName'] =  this.colors[0]
        //     item['color'] = this.colors[0]
        //     item['data'] = []
        //     for(let i in data.labelList){
        //         let jitem = {}
        //         jitem['x'] = '已完成'
        //         jitem['y'] = data.doneNumList[i]
        //         item.data.push(jitem)
        //     }
        //
        //     finalData.push(item)
        //
        // }
        //
        // if(data.normalNumList!=null){
        //     let item = {}
        //     item['seriesName'] =  this.colors[1]
        //     item['color'] = this.colors[1]
        //     item['data'] = []
        //     for(let i in data.labelList){
        //         let jitem = {}
        //         jitem['x'] = '正常推进'
        //         jitem['y'] = data.normalNumList[i]
        //         item.data.push(jitem)
        //     }
        //
        //     finalData.push(item)
        //
        // }
        //
        // if(data.onScheduleNumList!=null){
        //     let item = {}
        //     item['seriesName'] =  this.colors[2]
        //     item['color'] = this.colors[2]
        //     item['data'] = []
        //     for(let i in data.labelList){
        //         let jitem = {}
        //         jitem['x'] = '临期'
        //         jitem['y'] = data.onScheduleNumList[i]
        //         item.data.push(jitem)
        //     }
        //
        //     finalData.push(item)
        //
        // }
        //
        // if(data.overdueNumList!=null){
        //     let item = {}
        //     item['seriesName'] =  this.colors[3]
        //     item['color'] = this.colors[3]
        //     item['data'] = []
        //     for(let i in data.labelList){
        //         let jitem = {}
        //         jitem['x'] = '逾期'
        //         jitem['y'] = data.overdueNumList[i]
        //         item.data.push(jitem)
        //     }
        //
        //     finalData.push(item)
        //
        // }

        this.setState({
            sourceData:tempdata,
            tableTitle:tableTitle,
            tableData:tableData,
        })
    }

    getMaxValue(data){
        let maxArr = []
        maxArr.push(Math.max.apply(null, data.doneNumList))
        maxArr.push(Math.max.apply(null, data.normalNumList))
        maxArr.push(Math.max.apply(null, data.onScheduleNumList))
        maxArr.push(Math.max.apply(null, data.overdueNumList))
        let max = Math.max.apply(null, maxArr)
        // let max = 23
        if(max<5){
            max = 5
        }
        while(max % 5!=0){
            max++
        }
        return max
    }

    getMinValue(data){
        let minArr = []
        minArr.push(Math.min.apply(null, data.doneNumList))
        minArr.push(Math.min.apply(null, data.normalNumList))
        minArr.push(Math.min.apply(null, data.onScheduleNumList))
        minArr.push(Math.min.apply(null, data.overdueNumList))
        let min = Math.min.apply(null,minArr)
        // let min = 6

        while(min % 5!=0){
            min--
        }
        return min

    }

    static  navigationOptions = ({navigation}) =>({
        title: '督查统计',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.state.params.rightClick()
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{navigation.getParam('isChart')?'表格':'图表'}</Text>
        </TouchableOpacity>)
    });


    render() {

        // flexArr	Array	Flex value per column.	[]
        // widthArr	Array	Width per column.	[]
        // heightArr	Array	Height per line.

        const state = this.state;

        return (
            <View style={styles.container}>
                {state.isChart &&  this.state.sourceData.xAxis.data.length>0 && <ScrollView
                    style={{
                        flex: 1,
                        // backgroundColor: 'rgb(245, 252, 255)'
                    }}
                    contentContainerStyle={{
                        marginVertical: 10,
                        flex: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                    }}>
                    <Bar option={this.state.sourceData} height={400} />

                    <View style={styles.wrapper}>
                        <View style={styles.wrapper}>
                            <Image style={[styles.chartImg,{ backgroundColor:this.colors[1]}]} />
                            <Text style={styles.chartText}>已完成</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Image style={[styles.chartImg,{ backgroundColor:this.colors[2],marginLeft:8}]} />
                            <Text style={styles.chartText}>正常推进</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Image style={[styles.chartImg,{ backgroundColor:this.colors[3],marginLeft:8}]} />
                            <Text style={styles.chartText}>临期</Text>
                        </View>
                        <View style={styles.wrapper}>
                            <Image style={[styles.chartImg,{ backgroundColor:this.colors[4],marginLeft:8}]} />
                            <Text style={styles.chartText}>逾期</Text>
                        </View>
                    </View>
                </ScrollView>
                }

                {!state.isChart &&
                <Table borderStyle={{borderWidth: 1}}>
                    <Row data={state.tableHead} flexArr={[1, 1, 1, 1,1]} style={styles.head} textStyle={styles.text}/>
                    <TableWrapper style={styles.wrapper}>
                        <Col data={state.tableTitle} style={styles.title} heightArr={[40,40]} textStyle={styles.text}/>
                        <Rows data={state.tableData} flexArr={[1, 1, 1,1]} style={styles.row} textStyle={styles.text}/>
                    </TableWrapper>
                </Table>
                }
            </View>
        );
    }
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     backgroundColor: '#F5FCFF'
    // },
    chart: {
        flex: 1
    },
    chartImg:{
        height:16,width:16
    },
    chartText:{
        fontSize:16,
        color: '#333333',
        marginLeft:2,
    },

    container: { flex: 1, padding: 16,  backgroundColor: '#fff' },
    head: { height: 40,  backgroundColor: '#f1f8ff'  },
    wrapper: { flexDirection: 'row' },
    title: { flex: 1, backgroundColor: '#f6f8fa' },
    row: {  height: 40  },
    text: { textAlign: 'center' }


});

