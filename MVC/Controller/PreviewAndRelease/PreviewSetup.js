import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {HttpPost} from "../../Tools/JQFetch";
import URLS from "../../Tools/InterfaceApi";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {screenWidth, unitHeight, unitWidth} from "../../Tools/ScreenAdaptation";

var _that ;
export default class PreviewSetup extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '分值权重设置',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>
                { navigation.getParam('isInSelect') ? '完成' : '批量删除' }
            </Text>
        </TouchableOpacity>)
    });
    _ClickHeaderRightAction = () => {
        this.setState({
            isChecks: !this.state.isChecks,
        }, ()=>{
            this.props.navigation.setParams({ isInSelect: this.state.isChecks });
        });
    };
    constructor(props){
        super (props);
        _that = this;
        this.state = {
            data: {},
            dataList: [],
            isChecks:false,            //是否多选
            ids: [],                   //多选时，存储id，用来上报或驳回
        };
    }
    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        this._getListData();
    }
    _getListData = () => {
        let swId = this.props.navigation.getParam('item').swId;
        HttpPost(URLS.GetBaseSetup, {swId: swId}, '正在加载...').then((response)=>{
            RRCToast.show(response.msg);
            if (response.result === 1){
                const item = response.data;
                if (item.plusesList.length > 0) {
                    item.plusesList.map((i)=>{
                        i['select'] = false;
                    })
                }
                this.setState({
                    data: response.data,
                    dataList: item.plusesList,
                })
            }
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误');
        })
    };
    render(): React.ReactNode {
        return(
            <View style={{flex: 1}}>
                <FlatList renderItem={this._renderItemAction}
                          data={this.state.dataList}
                          keyExtractor={(item, index) => index.toString()}
                          ItemSeparatorComponent={() =>
                              <View style={{height: 1, backgroundColor: '#F4F4F4', marginLeft: 10*unitWidth}}/>}
                />
                <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                    width:screenWidth-16*unitWidth,}} onPress={this._onSave.bind(this)}>
                    <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                        alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                        {'保存'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    _renderItemAction = ({item}) =>{
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View style={styles.itemStyle}>
                    <View style={styles.itemLeftStyle}>
                        <Text style={{fontSize: 16 * unitWidth, fontWeight: 'bold'}}>{item.plusesName}</Text>
                        <Text>{'输入值范围: ' + item.minScore + '~' + item.maxScore}</Text>
                    </View>
                    {
                        this.state.isChecks === true ?
                            item.select === true ?
                                <View style={{justifyContent: 'center'}}>
                                    <Image source={require('../../Images/select_right.png')}
                                           style={{height: 15*unitWidth, width: 15*unitWidth, marginRight: 10*unitWidth}}
                                    />
                                </View>
                                :null
                            : null
                    }
                </View>
            </TouchableOpacity>
        )
    };
    _clickCellAction = (item) => {
        if (this.state.isChecks === false){
            this.props.navigation.navigate('PreviewSetupDetail', {item, callback: function (data) {
                    item.plusesName = data.plusesName;
                    item.minScore = data.minScore;
                    item.maxScore = data.maxScore;
                    _that.setState({
                        dataList : _that.state.dataList,
                    })
                }});
        } else {
            let arr = [];
            let idsArr = [];
            arr = arr.concat(this.state.dataList);
            idsArr = idsArr.concat(this.state.ids);
            arr.map((i)=>{
                if (i.id === item.id){
                    i.select = !item.select;
                    i.select === true ? idsArr.push(i.id) : idsArr.splice(idsArr.indexOf(i.id), 1);
                }
            });
            this.setState({dataList: arr, ids: idsArr});
        }
    };
    _onSave = () => {
        this.state.data.plusesList = this.state.dataList;
        HttpPost(URLS.SaveBaseSetup, this.state.data, '正在保存...').then((response)=>{
            RRCToast.show(response.msg);
        }).catch((err)=>{
            RRCAlert.alert('服务器内部错误')
        })
    }
}

const styles = StyleSheet.create({
    itemStyle:{
        flexDirection: 'row',
        height: 812 * unitHeight / 10,
        justifyContent: 'space-between',
    },
    itemLeftStyle:{
        justifyContent: 'space-between',
        marginTop: 10 * unitWidth,
        marginLeft: 10 * unitWidth,
        marginBottom: 10 * unitWidth,
    },
});
