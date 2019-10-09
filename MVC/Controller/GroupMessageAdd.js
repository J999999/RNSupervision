import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View, PixelRatio, TouchableOpacity
} from 'react-native';
import TextInputMultWidget from "../Widget/TextInputMultWidget";
import {screenWidth,unitWidth} from '../Tools/ScreenAdaptation';
import URLS from '../Tools/InterfaceApi';
import {HttpPost} from '../Tools/JQFetch';
import {RRCToast} from 'react-native-overlayer/src';
import {KeyboardAwareScrollView} from  'react-native-keyboard-aware-scroll-view';
import TextSelectWidget from '../Widget/TextSelectWidget';

let context =null
class GroupMessageAdd  extends React.Component {

    constructor(props){
        super(props);
        this.content = "";
        context = this
        this.deptData=[],
        this.selectValue ='',
        this.state = {
            receiverIds : '',
            receiverNames : '',
            isVisible: false,
            value: [{ key: 'feichanghuobao', label: '非长或薄' }]
        }
     }

     componentDidMount(): void {
        this.getDeptInfo()
     }

     getDeptInfo(){
         HttpPost(URLS.SmsGetDeptUser,{},"").then((response)=>{
             if(response.result == 1){
                 this.deptData = response.data
             }else{
                 alert(response.msg);
             }
         }).catch((err)=>{
             RRCToast.show(err);
         });
     }

    _pressSumbit =()=> {

        if(this.state.receiverIds==[] || this.state.receiverIds==''){
            RRCToast.show("请选择接收人");
            return ;
        }
        if(this.content==""){
            RRCToast.show("请输入内容");
            return ;
        }

        HttpPost(URLS.SmsSend,{'content':this.content,'receiverIds':this.state.receiverIds},"正在发送..").then((response)=>{
            RRCToast.show(response.msg);
            if(response.result == 1){
                this.props.navigation.state.params.callback()
                this.props.navigation.goBack();
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });

    };

    _pressDetail = ()=> {
        // navigation.navigate('AttachDetail',{item : attachItem});
    }

    static  navigationOptions = ({navigation}) =>({
        title: '新增',
    });

    setData(data){
        let treedata = []
        if(data){
            for(let i in data){
                let item = data[i]
                let dept = {}
                dept['key'] = item.deptId.toString()
                dept['label'] = item.deptName
                let children = []
                for(let j in item.userList){
                    let user = item.userList[j]
                    let temp = {}
                    temp['key'] = user.id.toString()
                    temp['label'] = user.username
                    children.push(temp)
                }

                dept['children'] = children
                treedata.push(dept)
            }
            return treedata
        }
    }

    selectResult(select){

        this.selectValue  = select
        let ids= []
        let names= []
        for(let i in select){
            let item = select[i]
            ids.push(item.key)
            names.push(item.label)
        }

        this.setState({
            receiverIds:ids ,
            receiverNames:names.join(',')
        })
    }



    render(){
        return (
            <View style = {styles.all}>
            <KeyboardAwareScrollView style = {styles.all}>

                <View style={styles.edit}>

                    <TextSelectWidget title='接收人员：' placehodler='' value = {this.state.receiverNames}
                        onPress={()=>{

                            this.props.navigation.navigate('EmpSelectList', {data:this.setData(this.deptData),value:this.selectValue,callback:function (select) {
                                context.selectResult(select)
                                }})
                        }}
                    />

                    <TextInputMultWidget defaultValue={ this.bean!=null  ?  this.bean.content :''}  title='内    容：'  placeholder='请输入' onChangeText={(text)=>{
                            this.content = text;
                    }}/>

                </View>

            </KeyboardAwareScrollView>

                <TouchableOpacity style={styles.button}    onPress={this._pressSumbit} >
                    <Text style={styles.buttonText}>发送</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

var styles = StyleSheet.create({

    all:{
        flex:1,
        backgroundColor:'#ffffff',
     },

    edit:{
      flex:1,
    },

    button:{
        margin:8*unitWidth,
        alignItems:'flex-end',
        width:screenWidth-16*unitWidth,
    },

    buttonText:{
        fontSize:18*unitWidth,
        color:'#FFF',
        padding:12*unitWidth,
        textAlign:'center',
        alignSelf:'stretch',
        backgroundColor:'#6CBAFF',
        borderRadius:5,
    },

    attach:{
        width:screenWidth,
        flexDirection:'row',
        flexWrap:'nowrap',
        alignItems:'center',
        // justifyContent:'space-between',
        borderBottomWidth: 0.5 / PixelRatio.get(),
        borderColor:'gray',//需要标色

    },
    attachText:{
        flex:1,
        marginLeft:10*unitWidth,
        marginTop:15*unitWidth,
        marginBottom:15*unitWidth,
        fontSize: 15*unitWidth,
        color: '#333',
    },

    rightIcon:{
        margin: 10*unitWidth,
    },

    delete:{
        width:30*unitWidth,
        height:29*unitWidth,
    },
})

module.exports = GroupMessageAdd
