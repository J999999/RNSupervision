import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    Image, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import {HttpPost} from '../Tools/JQFetch';
import URLS, {FILE_HOST, HOST} from '../Tools/InterfaceApi';
import {RRCLoading, RRCToast} from 'react-native-overlayer/src';
import {unitWidth} from '../Tools/ScreenAdaptation';
import AsyncStorage from '@react-native-community/async-storage';
import {FileDir, onClickDownLoad, onClickLook} from '../Tools/Utils';
import RNFetchBlob from 'rn-fetch-blob';

var screenWidth = Dimensions.get('window').width;

var context = null
class NoticeDetail extends Component {

    constructor(props){
        super(props);
        context = this;
        this.bean = null;
        this.fileList = [];
        this.state = {
            show:false,
        }
    };

    componentDidMount(): void {
        this.getNoticeInfo()
    }

    getNoticeInfo(){
        HttpPost(URLS.NoticeDetail,{id:this.bean.id},"").then((response)=>{
            // RRCToast.show(response.msg);
            if(response.result == 1){
                this.bean = response.data
                this.fileList = response.data.fileList
                for(let i in this.fileList){
                    let file = this.fileList[i]

                    RNFetchBlob.fs.exists(
                        FileDir + '/' + file.name
                    ).then((ex)=>{
                        ex ? file['exists'] = true : file['exists'] = false
                        if(ex){
                            this.setState({show:true})
                        }
                    })
                    this.setState({
                        show:true
                    })
                }

            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }
    static  navigationOptions = ({navigation}) =>({
        title: '公告详情',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{
                                            navigation.navigate('ReadList',{list:context.bean.readList});
                                        }}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{navigation.state.params.internal==1 ? '阅读情况' :''}</Text>
        </TouchableOpacity>)
    });

    openFile(item){
        onClickLook(item)
    }

    downLoadFile(item){
        RRCLoading.setLoadingOptions({text: '正在下载...'});
        RRCLoading.show();
        let  result = onClickDownLoad(item)
        result.then((res)=>{
            RRCLoading.hide()
            if(res.respInfo.status === 404){
                RRCToast.show('原文件已缺失');
            }
            if (res.respInfo.status === 200){
                RRCToast.show('下载成功');
                item.exists = true
                this.setState({
                    show:true
                });
            }
        })
    }


    render(){
        const  {params} = this.props.navigation.state;

        var buttons = [] ;
        var images = [];

        if(params && this.bean==null) this.bean = params.new

        for(let i in this.fileList){
            var button = (
                <TouchableOpacity  key = {i}  style= {styles.down}
                    onPress={() =>{
                        if(this.fileList[i].exists){
                            this.openFile(this.fileList[i])
                        }else{
                            this.downLoadFile(this.fileList[i])
                        }

                    }}
                >
                <Text  numberOfLines = {1}
                            style={styles.downText}> {(this.fileList[i].exists==true?'打开：':'下载附件:')+ this.fileList[i].name} </Text>
                </TouchableOpacity>
            );

            var image = (
                <Image
                    key ={i+1}
                    style={styles.img}
                    source={{ uri:FILE_HOST+this.fileList[i].url }} />
             );

            buttons.push(button);
            images.push(image)
        } ;

        return (
            <View style = {styles.all}>
                <ScrollView contentContainerStyle = {styles.scroll} >
                    <View style = {styles.main}>
                        <Text style = {styles.title}> {params.new.title} </Text>
                        <Text style = {styles.titleInfo}> 发布人：{params.new.createName} </Text>
                        <Text style = {styles.titleInfo}>
                            <Text> 发布时间: {params.new.publishTimeStr} </Text>
                        </Text>
                        <Text style={styles.line}>  </Text>
                        <Text style = {styles.content}> {params.new.content}</Text>

                        {
                            this.state.show == true ?  images  :  null
                        }
                    </View>
                </ScrollView>

                {buttons}

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

module.exports = NoticeDetail
