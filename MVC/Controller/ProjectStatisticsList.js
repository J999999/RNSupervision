import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,

} from 'react-native';
import {screenHeight, titleHeight, unitWidth} from '../Tools/ScreenAdaptation';

var navigation = null;
var context ;
/**
 * 督查统计选择列表
 */
export default class ProjectStatisticsList extends React.Component {

    constructor(props) {
        super(props);
        navigation = this.props.navigation;

        context = this;
         this.state = {
            sourceData : []
         };
     }

    componentDidMount() {
       const {params} =  navigation.state
       this.setState({
           sourceData:params.children
       })
    }

    // 自定义分割线
    _renderItemSeparatorComponent = ({highlighted}) => (
        <View style={{ height:1, backgroundColor:'#F4F4F4' }}></View>
    );

    // 下拉刷新
    _renderRefresh = () => {

    };

    // 上拉加载更多，暂时没有分页
    _onEndReached = () => {

    }

    _renderItem = ({item}) =>{
        console.log(item);
        return(
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('StatisticsCharts',{bean : item})
            }}>
                <FlatListItem detail={item}/>
            </TouchableOpacity>

        );
    };


    static  navigationOptions = ({navigation}) =>({
        title: '督查统计',

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

let styles = StyleSheet.create({

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
