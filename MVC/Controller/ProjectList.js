import React from 'react';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from 'react-native-overlayer/src';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
    Image,
    RefreshControl,
} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';
import {screenHeight, titleHeight, unitWidth} from '../Tools/ScreenAdaptation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PopSearchview from '../View/PopSearchview';
import DataDictionary from '../Tools/DataDictionary';

var navigation = null;
var context ;
export default class ProjectList extends React.Component {
    pageNo = 1;
    pageSize = 20;
    totalSize = 0;

    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        context = this;
        this.filter = {};
        this.state = {
            sourceData : []
            ,refreshing: false
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount(){

    }

    fetchData(){

        if(this.pageNo > this.totalSize/this.pageSize + 1){
            return ;
        }

        let data = {'pageNo':this.pageNo,'pageSize':this.pageSize}

        if(navigation.state.params.superviseStates != undefined){
            data['superviseStates'] = navigation.state.params.superviseStates
        }

        if(this.filter ){
            Object.assign(data,this.filter)
        }
        HttpPost(URLS.QueryProjectList,data,"获取信息中").then((response)=>{
            console.log(response.data)

            if(!response || !response.data && response.data.result != 1){
                RRCToast.show(response.msg);
            }

            let list = this.state.sourceData;
            if (this.pageNo === 1) {
                list = []
            }
            this.pageNo++;
            this.totalSize = response.data.total;
            list = list.concat(response.data.records);

            this.setState({
                sourceData:list,
                refreshing:false,
            })

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height:1, backgroundColor:'#F4F4F4' }}></View>
    );

    // 下拉刷新
    _renderRefresh = () => {
        this.pageNo = 1;
        this.setState({refreshing: true,sourceData : []})
        this.fetchData();
    };

    // 上拉加载更多，暂时没有分页
    _onEndReached = () => {
        this.fetchData();
    }

    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Detail',{new : item})
            }}>
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title: '立项交办',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('ProjectAdd',{
                                                callback:function(){
                                                    context._renderRefresh()
                                                }
                                            });
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>新增</Text>
        </TouchableOpacity>)
    });

    render() {

        return(
            <View style={{flex:1 }}>

                <PopSearchview dataSource={[
                    {'name':'名称内容', 'type':2, 'postKeyName':'queryStr'},
                    {'name':'编辑人员', 'type':2, 'postKeyName':'creatorName'},
                    {'name':'事项分类', 'type':3, 'postKeyName':'projectTypes', 'dataSource':
                            [
                                {'name': '重点项目', 'id': '1'},
                                {'name': '领导批示', 'id': '2'},
                                {'name': '决策部署', 'id': '3'},
                                {'name': '政务督查', 'id': '4'},
                                {'name': '民生实事', 'id': '5'},
                                {'name': '两代表一委员建议（议案）', 'id': '6'},
                                {'name': '其他工作', 'id': '7'},
                            ]
                    },
                    {'name':'工作属性', 'type':3, 'postKeyName':'workAttrs', 'dataSource':
                            [
                                {'name': '常规', 'id': '1'},
                                {'name': '阶段', 'id': '2'},
                                {'name': '临时', 'id': '3'},
                                {'name': '紧急', 'id': '4'},
                            ]
                    },
                    {'name':'督查状态', 'type':3, 'postKeyName':'superviseStates', 'dataSource':
                            [
                                {'name': '待审批', 'id': '1'},
                                {'name': '正常督查', 'id': '2'},
                                {'name': '待承办单位接收', 'id': '3'},
                                {'name': '暂停督查', 'id': '4'},
                                {'name': '停止督查', 'id': '5'},
                                {'name': '督查转办-待接收', 'id': '6'},
                                {'name': '已撤回', 'id': '7'},
                            ]
                    },
                    {'name':'进展情况', 'type':3, 'postKeyName':'progress', 'dataSource':
                            [
                                {'name': '已完成', 'id': '1'},
                                {'name': '正常推进', 'id': '2'},
                                {'name': '临期', 'id': '3'},
                                {'name': '逾期', 'id': '4'},
                            ]
                    },
                    {'name':'汇报审核状态', 'type':3, 'postKeyName':'reportApprovalStates', 'dataSource':
                            [
                                {'name': '无汇报', 'id': '1'},
                                {'name': '待审核', 'id': '2'},
                                {'name': '审核通过', 'id': '3'},
                                {'name': '审核驳回', 'id': '4'},
                            ]
                    },
                    {'name':'审批状态', 'type':3, 'postKeyName':'approvalStates', 'dataSource':
                            [
                                {'name': '未提交', 'id': '1'},
                                {'name': '待审批', 'id': '2'},
                                {'name': '审批中', 'id': '3'},
                                {'name': '审批通过', 'id': '4'},
                                {'name': '驳回', 'id': '5'},
                            ]
                    },
                    {'name':'查询时间', 'type':1, 'postKeyName':'createStartTime' ,'postKeyNameEnd':'createEndTime'}
                 ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(queryData)=>{
                                   console.log('----'+JSON.stringify(queryData))
                                   for(let i in queryData){
                                       let item = queryData[i]
                                       for(let j in item){
                                           if(j!=='title' && j!=='name'){
                                               if(item[j] instanceof  Array){
                                                   this.filter[j] = item[j].join(",")
                                               }else{
                                                   this.filter[j] = item[j]
                                               }
                                           }
                                       }

                                   }
                                   console.log('llllll====='+JSON.stringify(this.filter))
                                   this.pageNo = 1
                                   this.fetchData()
                               }}
                />

                <View style={{position: 'absolute', right: 15*unitWidth, bottom: 50*unitWidth ,zIndex:3 }}>
                    <TouchableOpacity activeOpacity={.5} onPress={()=>{this.popSearchview._show()}}>
                        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange',
                            padding: 5*unitWidth, height: 54*unitWidth, width: 54*unitWidth,
                            borderRadius: 108*unitWidth}}>
                            <Image source={require('../Images/filter_search.png')}
                                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>
                        </View>
                    </TouchableOpacity>
                </View>

                <FlatList
                style = {styles.container}
                ref={ ref => this.flatList = ref }
                data={ this.state.sourceData }
                extraData={ this.state}
                pageSize={this.pageSize}
                keyExtractor={ this._keyExtractor }
                renderItem={ this._renderItem }
                onEndReachedThreshold={0.2}
                onEndReached={ this._onEndReached }
                ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                refreshing={ this.state.refreshing }
                onRefresh={ this._renderRefresh }
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index + 50, index } )}
            />


            </View>

        );
    }
};



class FlatListItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return(

            <TouchableHighlight
                underlayColor={"#EEE"}
                onPress={()=> {navigation.navigate('ProjectDetail',{bean :this.props.detail})}    }
            >
                <View style={styles.thumbnail}>
                    <Text style={styles.rowTitle}>{this.props.detail.projectName}</Text>
                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>{ this.props.detail.createTime }</Text>
                        <Text style={styles.rowSmallTitle}>编辑人：{this.props.detail.creatorName}</Text>
                    </View>
                    <View style={styles.view}>
                        <Text style={styles.rowSmallTitle}>分类：{ DataDictionary.MatterTypes[this.props.detail.projectType] }</Text>
                        <Text style={styles.rowSmallTitle}>属性：{DataDictionary.WorkTypes[this.props.detail.workAttr]}</Text>
                    </View>

                    <Text style={styles.rowContent} numberOfLines={2}>{this.props.detail.projectInfo}</Text>

                </View>
            </TouchableHighlight>


        );
    }
};

var styles = StyleSheet.create({

        loading:{
            flex:1,
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#F5FcFF',
        },

        container:{
            flex:1,
            backgroundColor:'#ffffff',
            height:screenHeight-titleHeight
        },

        thumbnail: {
            padding: 15*unitWidth,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#D9D7D5',
            overflow: 'hidden',
            backgroundColor: "#FFF"
        },

        view:{
            flexDirection:'row',
            justifyContent:'space-between',
        },

        rowTitle: {
            fontSize: 16*unitWidth,
            color: "#2F3D4F"
        },
        rowSmallTitle: {
            fontSize: 13*unitWidth,
            marginTop: 5*unitWidth,
            color: "#A5A5AF"
        },
        rowContent: {
            fontSize: 12*unitWidth,
            marginTop: 5*unitWidth,
            color: "#A5A5AF"
        },
    }
)
