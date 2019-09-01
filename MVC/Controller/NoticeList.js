import React from 'react';
import URLS from '../Tools/InterfaceApi';
import {RRCAlert, RRCToast} from 'react-native-overlayer/src';
import {View, StyleSheet, Text, FlatList, TouchableHighlight, DeviceEventEmitter, TouchableOpacity,Image} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';
import {unitWidth} from '../Tools/ScreenAdaptation';

var navigation = null;
var context ;
var newItemSelect;
var count = 1;
var emitter = null;

export default class NoticeList extends React.Component {
    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        context = this;
        this.state = {
            sourceData : []
            ,selected: (new Map(): Map<String, boolean>)
            ,refreshing: false
        }
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
        emitter = DeviceEventEmitter.addListener('refresh',this._renderRefresh);

    }

    componentWillUnmount(){
        emitter.remove();
    }
    fetchData(){
        HttpPost(URLS.QueryNoticeList,{},"获取公告通知").then((response)=>{
            // console.log(response)
            console.log(response.data)

            if(!response || !response.data && response.data.result != 1){
                RRCToast.show(response.msg);
            }

            if(this.state.refreshing){
                this.setState({
                    sourceData:response.data.records,
                    refreshing:false,
                })
            }else{
                this.setState({
                    sourceData:this.state.sourceData.concat(response.data.records),
                })
            }

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
                this._renderRefresh
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
                this._renderRefresh
            }else{
                RRCToast.show(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }


    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height:1, backgroundColor:'#F4F4' }}></View>
    );

    // 下拉刷新
    _renderRefresh = () => {
        count = 1;
        this.setState({refreshing: true,sourceData : []})
        this.fetchData();
    };

    // 上拉加载更多，暂时没有分页
    _onEndReached = () => {
        // count=count+1;
        // this.fetchData();
    }

    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => {
                newItemSelect = item;
                this.props.navigation.navigate('Detail',{new : item})
            }}>
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title: '公告通知',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('NoticeAdd');
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>新增</Text>
        </TouchableOpacity>)
    });

    render() {

        return(
            <FlatList
                style = {styles.container}
                ref={ ref => this.flatList = ref }
                data={ this.state.sourceData }
                extraData={ this.state.selected }
                keyExtractor={ this._keyExtractor }
                renderItem={ this._renderItem }
                onEndReachedThreshold={0.1}
                onEndReached={ this._onEndReached }
                ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                // ListEmptyComponent={ this._renderEmptyView }
                refreshing={ this.state.refreshing }
                onRefresh={ this._renderRefresh }
                getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index + 50, index } )}
            />
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
                                    navigation.navigate('NoticeAdd',{bean:this.props.detail})
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
                onPress={()=> {navigation.navigate('NoticeDetail',{new :this.props.detail})}    }
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

        thumbnail: {
            padding: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: '#D9D7D5',
            overflow: 'hidden',
            backgroundColor: "#FFF"
        },

        rowTitle: {
            fontSize: 16,
            color: "#2F3D4F"
        },
        rowSmallTitle: {
            fontSize: 13,
            marginTop: 5,
            color: "#A5A5AF"
        },
        rowContent: {
            fontSize: 12,
            marginTop: 5,
            color: "#A5A5AF"
        },
        imageButton: {
            position: 'absolute',
            right: 12,
            top: 20,
            width: 25,
            height: 25
        },
        image : {
            marginBottom:8,
            width: 20,
            height: 20
        },
    }
)
