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
var context ;
export default class NoticeList extends React.Component {
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
        this.filter = {}
    }

    fetchData(){

        if(this.pageNo > this.totalSize/this.pageSize + 1){
            return ;
        }

        let data = {'pageNo':this.pageNo,'pageSize':this.pageSize}
        if(this.filter ){
            Object.assign(data,this.filter)
        }
        HttpPost(URLS.QueryNoticeList,data,"获取公告通知").then((response)=>{
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


    fetchRecall(item){


        HttpPost(URLS.NoticeRecall,{id:item.id},"正在撤销").then((response)=>{
            console.log(response)

            if(response.result == 1){
                this._renderRefresh()
            }else{
                RRCToast.show(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    fetchDelete(item){
        HttpPost(URLS.NoticeDelete,{id:item.id},"正在删除").then((response)=>{
            console.log(response)

            if(response.result == 1){
                this._renderRefresh()
            }else{
                RRCToast.show(response.msg);
            }

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
        title: navigation.state.params.title ,
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('NoticeAdd',{
                                                callback:function(){
                                                    context._renderRefresh()
                                                }
                                            });
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{navigation.state.params.internal==1 ?'新增':''}</Text>
        </TouchableOpacity>)
    });

    render() {

        return(
            <View style={{flex:1 }}>

                <PopSearchview dataSource={[
                    {'name':'标题内容', 'type':2, 'postKeyName':'queryStr'},
                    {'name':'发布人', 'type':2, 'postKeyName':'creatorName'},


                    {'name':'状态查询', 'type':3, 'postKeyName':'queryState', 'dataSource':
                            [
                                {'name': '已发布', 'id': 0},
                                {'name': '已撤回', 'id': 1},
                                {'name': '已读', 'id': 2},
                                {'name': '未读', 'id': 3},
                            ]
                    },
                    {'name':'查询时间', 'type':1, 'postKeyName':'startTime' ,'postKeyNameEnd':'endTime'}
                 ]}
                               ref={ref => this.popSearchview = ref}
                               callback={(queryData)=>{
                                   //----[{"title":"标题内容","queryStr":"擦得"},{"title":"发布人","creatorName":"把手"},{"title":"状态查询","queryState":"0,","name":"已发布,"},{"title":"查询时间","startTime":"2019-09-03","endTime":"2019-09-05"}]
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

        var images = [];
        if(this.props.detail.buttons){
            for(let item in this.props.detail.buttons){
                switch (this.props.detail.buttons[item].name) {
                    case 'RECALL':
                        images.push(
                            <TouchableOpacity
                                onPress={()=>{
                                    // context.fetchRecall(this.props.detail)

                                    RRCAlert.alert("提示","是否确定要进行撤销操作？",[{
                                        text: '是' ,style:{color:'#38ADFF', fontWeight: 'bold'}}
                                        ,{
                                            text: '否',style:{color:'#38ADFF', fontWeight: 'bold'}
                                        }
                                    ],context.callbackRecall.bind(this,this.props.detail))

                                }}   >
                                <Image style={styles.image}  source={require("../Images/icon_recall.png") }  />
                            </TouchableOpacity> )
                        break;
                    case 'EDIT':
                        images.push(
                            <TouchableOpacity
                                onPress={()=>{
                                    navigation.navigate('NoticeAdd',{bean:this.props.detail,
                                        callback:function(){
                                            context._renderRefresh()
                                        }
                                    })
                                }}  >
                                <Image style={styles.image} source={require("../Images/icon_edit.png") }  />
                            </TouchableOpacity> )
                        break;
                    case 'DELETE':
                        images.push(
                            <TouchableOpacity
                                 onPress={()=>{
                                    // context.fetchDelete(this.props.detail)
                                     RRCAlert.alert("提示","是否确定要进行删除操作？",[{
                                         text: '是' ,style:{color:'#38ADFF', fontWeight: 'bold'}}
                                         ,{
                                             text: '否',style:{color:'#38ADFF', fontWeight: 'bold'}
                                         }
                                     ],context.callbackDelete.bind(this,this.props.detail))
                                }}   >
                                <Image style={styles.image} source={require("../Images/icon_delete.png") }  />
                            </TouchableOpacity> )
                        break;
                }
            }
        }

        var content = this.props.detail.content
        if(this.props.detail.content.length > 22 ){
            content = this.props.detail.content.substr(0,22)
            content = content +'...'
        }

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
                        {content}
                    </Text>

                    <View style={styles.imageButton}>
                        { images}
                    </View>
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
            width: 34*unitWidth,
            height: 34*unitWidth,
        },
        image : {
            marginBottom:4*unitWidth,
            width: 28*unitWidth,
            height: 28*unitWidth,
        },
    }
)
