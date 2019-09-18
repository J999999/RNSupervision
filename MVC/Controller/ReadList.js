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
} from 'react-native';
import { HttpPost} from '../Tools/JQFetch';
import {screenHeight, titleHeight, unitWidth} from '../Tools/ScreenAdaptation';

var navigation = null;
var context ;
export default class ReadList extends React.Component {


    constructor(props) {
        super(props);
        navigation = this.props.navigation;
        context = this;

        this.state = {
            sourceData : [],
            refreshing: false
        };
        this.fetchData = this.fetchData.bind(this);
    }

    componentDidMount() {
        this.fetchData();
    }

    componentWillUnmount(){
    }

    fetchData(){
        const  {params} = this.props.navigation.state;
        this.setState({
            sourceData:params.list
        })

    }

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height:1, backgroundColor:'#F4F4F4' }}></View>
    );

    // 下拉刷新
    _renderRefresh = () => {
        // this.pageNo = 1;
        // this.setState({refreshing: true,sourceData : []})
        // this.fetchData();
    };

    // 上拉加载更多，暂时没有分页
    _onEndReached = () => {
        // this.fetchData();
    }

    _renderItem = ({item}) =>{
        return(
            <TouchableOpacity   >
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title: '阅读情况',
    });

    getTimeStamp(isostr) {
        var parts = isostr.match(/\d+/g);
        // return new Date(parts[0]+'-'+parts[1]+'-'+parts[2]+' '+parts[3]+':'+parts[4]+':'+parts[5]).getTime();
        return  parts[0]+'-'+parts[1]+'-'+parts[2]+' '+parts[3]+':'+parts[4]+':'+parts[5]  ;
    }

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
                // refreshing={ this.state.refreshing }
                // onRefresh={ this._renderRefresh }
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
            >
                <View style={styles.thumbnail}>
                    <Text style={styles.rowTitle}>{this.props.detail.readUserName}</Text>
                    <Text
                        style={styles.rowSmallTitle}>{ context.getTimeStamp(this.props.detail.readTime ) }   {this.props.detail.readUnitName}  </Text>

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
