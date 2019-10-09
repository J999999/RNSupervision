import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView, TouchableOpacity,
} from 'react-native';
import {HttpPost} from '../Tools/JQFetch';
import URLS from '../Tools/InterfaceApi';
import {RRCLoading, RRCToast} from 'react-native-overlayer/src';
import {unitWidth,screenWidth} from '../Tools/ScreenAdaptation';

var context = null
class GroupMessageDetail extends Component {

    constructor(props){
        super(props);
        context = this;
        this.bean = null;
        this.state = {
            show:false,
        }
    };

    componentDidMount(): void {
        this.getInfo()
    }

    getInfo(){
        HttpPost(URLS.SmsDetail,{id:this.bean.id},"").then((response)=>{
            if(response.result == 1){
                this.bean = response.data
                this.setState({
                    show:true
                })
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }
    static  navigationOptions = ({navigation}) =>({
        title: '短信详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            context._pressSumbit()
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{navigation.state.params.bean.state==1?'':'重发'}</Text>
        </TouchableOpacity>)
    });

    _pressSumbit =()=> {
        HttpPost(URLS.SmsResend,{'id':this.bean.id },"正在发送..").then((response)=>{
            if(response.result == 1){
                RRCToast.show(response.msg);
                this.props.navigation.state.params.callback()
                this.props.navigation.goBack();
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });

    };

    render(){
        const  {params} = this.props.navigation.state;
        if(params && this.bean==null) this.bean = params.bean

        return (
            <View style = {styles.all}>
                <ScrollView contentContainerStyle = {styles.scroll} >
                    <View style = {styles.main}>
                        <Text style = {styles.title}> 短信群发 </Text>
                        <View style = {styles.titleInfo}>
                            <Text style={{color: "#A5A5AF"}}> 接收人: {this.bean.receiverName} </Text>
                        </View>
                        <View style = {styles.titleInfo}>
                            <Text style={{color: "#A5A5AF"}}> 发布人: {this.bean.creatorName} </Text>
                        </View>
                        <View style = {styles.titleInfo}>
                            <Text style={{color: "#A5A5AF"}} > 发布时间: {this.bean.createTime} </Text>
                        </View>
                        <View style = {styles.titleInfo}>
                            <Text style={{color: "#A5A5AF"}}> 发布状态: {this.bean.state == 0 ?'发送失败' : '发送成功'} </Text>
                        </View>
                        <View style={styles.line} />
                        <Text style = {styles.content}> {this.bean.content}</Text>
                    </View>
                </ScrollView>
            </View>

        );
    }
}

var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#fff',
    },

    scroll:{
        backgroundColor:'#fff',
        paddingTop:15,
    },

    main:{
        flex:1,
        alignItems:'center',
    },

    title:{
        color:'#000000',
        fontSize:20,
        marginBottom:8,
        marginLeft:8,
        marginRight:8,
    },

    titleInfo:{
        alignSelf:'flex-start',
        fontSize:14,
        marginLeft:8,
        marginRight:8,
        marginBottom:5,
    },

    content:{
        alignSelf:'flex-start',
        marginLeft:8,
        marginRight:8,
        marginTop:10,
        fontSize:16,
    },

    font:{
        fontSize:14,
        color:'orange',
    },

    line:{
        height:0.5,
        margin:5,
        width:600,
        backgroundColor:'gray',
    },

    down:{
        width:screenWidth,
        padding:5,
        // backgroundColor:'blue',
        alignSelf:'flex-end',
    },

    downText:{
        padding:10,
        fontSize:16,
        color:'white',
        backgroundColor:'#6CBAFF',
        borderRadius:4,
    },

    img:{
        marginTop:50,
        width: 250,
        height: 250,
    }
})

module.exports = GroupMessageDetail
