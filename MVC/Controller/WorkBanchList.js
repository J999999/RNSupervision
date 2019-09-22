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

        this.workBanchUrls={
            46:URLS.WorkBenchQueryMyFollow,//我的关注
            49:URLS.WorkBenchQueryLeaderOpinion,//领导批示意见
            51:URLS.WorkBenchQueryTodoList,//待办事项
            52:'',//通知公告
            53:'',//预警信息
        }

         this.state = {
            sourceData : []
         };
     }

    componentDidMount() {
       const {params} =  navigation.state

       let id = params.id

       this.getInfo(this.workBanchUrls[id])

    }

    getInfo(url){
        HttpPost(url,{},"正在加载").then((response)=>{
            if(response.result == 1){
                console.log(response.data)
                if(response.data==null || response.data ==[]){
                    return
                }
                this.setData(response.data)

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

    };

    _onEndReached = () => {

    }

    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('StatisticsCharts',{bean : item})
            }}>
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title:navigation.state.params==null?'工作台':navigation.state.params.title,
    });

    render() {

        return(
            <View style={{flex:1 }}>

                <FlatList
                style = {styles.container}
                ref={ ref => this.flatList = ref }
                data={ this.state.sourceData }
                extraData={ this.state}
                keyExtractor={ this._keyExtractor }
                renderItem={ this._renderItem }
                onEndReachedThreshold={0.2}
                onEndReached={ this._onEndReached }
                ItemSeparatorComponent={ this._renderItemSeparatorComponent }
                refreshing={ false}
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

                <View style={styles.thumbnail}>
                    <Text style={styles.rowTitle}>{this.props.detail.name}</Text>

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
