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
import PopSearchview from '../View/PopSearchview';

var navigation = null;
/**
 * 工作台--通知公告
 */
export default class WorkBenchNoticeList extends React.Component {
    pageNo = 1;
    pageSize = 20;
    totalSize = 0;

    constructor(props) {
        super(props);
        navigation = this.props.navigation;

        // this.filter = {};
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
        // this.filter = {}
    }

    fetchData(){

        if(this.pageNo > this.totalSize/this.pageSize + 1){
            return ;
        }

        // let data = {'pageNo':this.pageNo,'pageSize':this.pageSize,'queryState':3}
        let data = {'pageNo':this.pageNo,'pageSize':this.pageSize }
        // if(this.filter ){
        //     Object.assign(data,this.filter)
        // }
        HttpPost(URLS.QueryNoticeList,data,"获取公告通知").then((response)=>{

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

    callbackRecall = (item, index) =>{
        if(index===0){
            this.fetchRecall(item)
        }
    }

    callbackDelete = (item, index) =>{
        if(index===0){
            this.fetchDelete(item)
        }
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

    // 上拉加载更多
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
        title: navigation.state.params.title,

    });

    render() {

        return(
            <View style={{flex:1 }}>

                {/*<PopSearchview dataSource={[*/}
                {/*    {'name':'标题内容', 'type':2, 'postKeyName':'queryStr'},*/}
                {/*    {'name':'发布人', 'type':2, 'postKeyName':'creatorName'},*/}

                {/*    {'name':'查询时间', 'type':1, 'postKeyName':'startTime' ,'postKeyNameEnd':'endTime'}*/}
                {/* ]}*/}
                {/*               ref={ref => this.popSearchview = ref}*/}
                {/*               callback={(queryData)=>{*/}
                {/*                   for(let i in queryData){*/}
                {/*                       let item = queryData[i]*/}
                {/*                       for(let j in item){*/}
                {/*                            if(j!=='title' && j!=='name'){*/}
                {/*                                if(item[j] instanceof  Array){*/}
                {/*                                    this.filter[j] = item[j].join(",")*/}
                {/*                                }else{*/}
                {/*                                    this.filter[j] = item[j]*/}
                {/*                                }*/}
                {/*                            }*/}
                {/*                       }*/}
                {/*                   }*/}
                {/*                   this.pageNo = 1*/}
                {/*                   this.fetchData()*/}
                {/*               }}*/}
                {/*/>*/}

                {/*<View style={{position: 'absolute', right: 15*unitWidth, bottom: 50*unitWidth ,zIndex:3 }}>*/}
                {/*    <TouchableOpacity activeOpacity={.5} onPress={()=>{this.popSearchview._show()}}>*/}
                {/*        <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange',*/}
                {/*            padding: 5*unitWidth, height: 54*unitWidth, width: 54*unitWidth,*/}
                {/*            borderRadius: 108*unitWidth}}>*/}
                {/*            <Image source={require('../Images/filter_search.png')}*/}
                {/*                   style={{width: 20*unitWidth, height: 20*unitWidth}}/>*/}
                {/*        </View>*/}
                {/*    </TouchableOpacity>*/}
                {/*</View>*/}


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
                onPress={()=> {navigation.navigate('NoticeDetail',{new :this.props.detail,'internal':navigation.state.params.internal})}    }
            >
                <View style={styles.thumbnail}>
                    <Text style={styles.rowTitle}>{this.props.detail.title}</Text>
                    <Text
                        style={styles.rowSmallTitle}>{ this.props.detail.publishTimeStr }  发布人：{this.props.detail.creatorName}  </Text>
                    <Text style={styles.rowContent} numberOfLines={2}>
                        {this.props.detail.content}
                    </Text>

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
            backgroundColor: "#FFF",
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
        imageButton: {
            position: 'absolute',
            right: 12*unitWidth,
            top: 20*unitWidth,
            width: 40*unitWidth,
            height: 40*unitWidth,
        },
        image : {
            marginBottom:6*unitWidth,
            width: 28*unitWidth,
            height: 28*unitWidth,
        },
    }
)
