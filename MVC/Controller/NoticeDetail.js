import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    Image, ScrollView, TouchableHighlight, TouchableOpacity, Dimensions, DeviceEventEmitter,
} from 'react-native';

var screenWidth = Dimensions.get('window').width;

class NoticeDetail extends Component {

    constructor(props){
        super(props);
        this.state = {
            show:false,
        }
    };

    componentWillUnmount() {
        DeviceEventEmitter.emit('refresh');
    }

    componentDidMount(){
        let {params} = this.props.navigation.state;
        // if(params.new && params.new.staffChildNotice && params.new.staffChildNotice.isread == 0 )
        //     this._updateNoticeState(params.new.id);
     }

    _updateNoticeState = async (id) => {
        // let formData = new FormData();
        // formData.append("id",id);
        // formData.append("memberId",'7756');
        //
        // fetch(this.REQUEST_URL_GET,{
        //     method:'POST',
        //     headers:{
        //         'Accept':'application/json',
        //         'Content-Type': 'multipart/form-data;charset=utf-8',
        //     },
        //     body:formData,
        // }).then((response)=>{
        //     return response.json() ;
        // }).then((responseData)=>{
        //     // console.warn(responseData);
        //     Toast.show(responseData.msg);
        //  }).catch((error)=>{
        //     console.log(error)
        // })
    }


    render(){
        const  {params} = this.props.navigation.state;

        var buttons = [] ;
        var images = [];

        for(let i in params.new.attachmentList){
            var button = (
                <TouchableOpacity  key = {i}  style= {styles.down}
                    onPress={() =>
                    this.setState({
                        show : true,
                    })}>

                    <Text   numberOfLines = {1}
                            // style={styles.downText}> {'下载附件:'+ params.new.attachmentList[i].fileName} </Text>
                            style={styles.downText}> {'下载附件:'} </Text>
                </TouchableOpacity>
            );

            var image = (
                <Image
                    key ={i+1}
                    style={styles.img}
                    // source={{ uri: params.new.attachmentList[i].fileUrl }} />
                    source={{ uri:  '' }} />
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
                            {/*<Text style = {styles.font}>      已阅：{params.new.countReaded} / {params.new.count}</Text>*/}
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
