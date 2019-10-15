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
    Image
} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';
import {screenHeight, titleHeight, unitWidth} from '../Tools/ScreenAdaptation';
import AsyncStorage from '@react-native-community/async-storage';

var navigation = null;
var context ;
/**
 * 工作台列表
 */
export default class WorkBanchList extends React.Component {

    constructor(props) {
        super(props);
        navigation = this.props.navigation;

        context = this;
        this.internal = ''//是否内部角色 1=是 、0=否
        this.roleLevel = ''//级别

        this.todoType = null

        this.id = ''

        this.workBanchUrls={
            46:URLS.WorkBenchQueryMyFollow,//我的关注
            47:URLS.WorkBenchQueryMyOpinion,//我的批示
            49:URLS.WorkBenchQueryLeaderOpinion,//领导批示意见
            50:URLS.WorkBenchQueryMyOpinion,//我的意见建议
            51:URLS.WorkBenchQueryTodoList,//待办事项
        }

         this.state = {
            data : [],
             hasData:true
         };
     }

    componentDidMount() {
       const {params} =  navigation.state

        this.id = params.id

       this.getInfo(this.workBanchUrls[this.id])

        AsyncStorage.getItem('internal').then((value) => {
            this.internal = JSON.parse(value)
        });

        AsyncStorage.getItem('roleLevel').then((value) => {
            this.roleLevel = JSON.parse(value)
        });
    }

    getInfo(url){
        HttpPost(url,{},"正在加载").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                if(response.data==null || response.data.length <1){
                    this.setState({hasData:false})
                }else{
                    //待办事项，去掉客户端没有的数据
                    if(this.id == 51 ){
                        response.data.map((item)=>{
                            if(item.todoType!=1 && item.todoType!=9 && item.todoType!=10&& item.todoType!=11){
                                return item
                            }
                        })
                    }
                    this.setState({data:response.data,hasData:true})
                }
            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height:1, backgroundColor:'#F4F4F4' }}></View>
    );

    _renderRefresh = () => {
        this.componentDidMount()
    };

    _onEndReached = () => {

    }

    _gotoNext(item){
        //待办事项
        //待办事项类型（1-承办待接收事项 2-临期待汇报事项 3-转办待接收事项 4-主体责任待审批事项 6-约谈待实施
        // 7-立项交办审批 8-约谈问责发布审批 9-延期申请审批 10-约谈申请审批 11-问责申请审批 12-问责待实施）
        if(this.id == 51){
            // switch (12) {
            switch (item.todoType) {
                case 2://工作督查-工作汇报
                    navigation.navigate('WorkReportList',{
                        internal:this.internal,
                    });
                    break;
                case 3://工作督查-立项交办：查询条件“督查状态”默认“督查转办待接收”
                    navigation.navigate('ProjectList',{
                        internal:this.internal,
                        superviseStates:6
                    });
                    break;
                case 4://主体责任-工作审核
                    navigation.navigate('ApprovalWorkList',{
                        'approveStates':[1]
                    });
                    break;
                case 6://效能问责-督查约谈：查询条件“状态”默认“待约谈”
                    navigation.navigate('IInterviewList',{
                        'states':[1]
                    });
                    break;
                case 7://工作督查-意见审批：查询条件“督查状态”默认“待审批”
                    navigation.navigate('OpinionApprovalList',{
                        internal:this.internal,
                        superviseStates:[1]
                    });
                    break;
                case 8://效能问责-效能审核：查询条件“状态”默认“发布待审核”
                    //AuditList
                    navigation.navigate('AuditList',{
                        states:[1]
                    });
                    break;
                case 12://效能问责-效能问责：查询条件“状态”默认“待问责”
                    //AccountabilityList
                    navigation.navigate('AccountabilityList',{
                        states:[1]
                    });
                    break;
            }
        }else{
            this.getProjectInfo(item)
            //更新阅读状态
            this.setReadState(item)
        }

    }

    getMore(){
        switch (this.id) {
            case 46:
            case 47:
            case 50:
                navigation.navigate('OpinionApprovalList',{
                    internal:this.internal,
                });
                break;
            case 49: //领导批示意见
                //内部四级
                if(this.internal==1 && this.roleLevel ==4){
                    navigation.navigate('ProjectList',{

                    });
                }else{
                    navigation.navigate('OpinionApprovalList',{
                        internal:this.internal,
                    });
                }
                break;
        }
    }
    //更新阅读状态
    setReadState(item){

        HttpPost(URLS.WorkBenchSaveRead,{'projectId':item.projectId,'readType':item.dataType,},"").then((response)=>{
            if(response.result == 1){
                console.log(response.data)

            }else{
                alert(response.msg);
            }
        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    getProjectInfo(item){
        HttpPost(URLS.ProjectDetail,{'id':item.projectId},"").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                // navigation.navigate('OpinionDetail',{
                navigation.navigate('ReportOpinionSummary',{
                    bean:response.data,
                    callback:function(){

                    }
                });
            }else{
                alert(response.msg);
            }

        }).catch((err)=>{
            RRCToast.show(err);
        });
    }

    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => {
                this._gotoNext(item)
            }}>
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title:navigation.state.params==null?'工作台':navigation.state.params.title,
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{ context.getMore()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{navigation.state.params.id!=51 ?'更多':''}</Text>
        </TouchableOpacity>)
    });

    render() {

        return(
            <View style={{flex:1 }}>
                {this.state.hasData &&  <FlatList
                    style = {styles.container}
                    ref={ ref => this.flatList = ref }
                    data={ this.state.data }
                    extraData={ this.state}
                    keyExtractor={ this._keyExtractor }
                    renderItem={ this._renderItem }
                    onEndReachedThreshold={0.2}
                    onEndReached={ this._onEndReached }
                    ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                    refreshing={ false}
                    onRefresh={ this._renderRefresh }
                    getItemLayout={(data, index) => ( { length: 40, offset: (40 + 1) * index + 50, index } )}
                />}
                {!this.state.hasData && <Text style={[styles.rowTitle,{flex:1,textAlign: 'center',marginTop:30*unitWidth}] } >暂无数据</Text>}

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

                <View style={styles.thumbnail}>
                    <Text style={ styles.rowTitle }  numberOfLines = {1}>{this.props.detail.infoStr}</Text>

                </View>

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

    }
)
