import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {unitWidth} from "../Tools/ScreenAdaptation";
import AutoTextInput from '../Tools/AutoTextInput';
import {RRCAlert} from "react-native-overlayer/src";

export default class CheckList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '请输入或选择',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'确定'}</Text>
        </TouchableOpacity>)
    });

    constructor(props){
        super(props);
        this.multipeSelect= true
        this.state = {
            InputString: '',
            data: [],
        };
    }

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        this.multipeSelect = navigation.getParam('multipeSelect')
        let arr = navigation.getParam('dataSource');
        let dataArr = [];
        dataArr = dataArr.concat(this.state.data);
        for (let i=0; i<arr.length; i++){
            dataArr.push({'code':i, 'name':arr[i].name, 'select': false, 'id': arr[i].id});
        }
        this.setState({data: dataArr});
    }
    _ClickHeaderRightAction = () => {
        this.props.navigation.state.params.refresh(this.state.data);
        this.props.navigation.goBack();
    };

    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <View
                    style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center',
                        borderBottomColor:'#F4F4F4', borderBottomWidth: unitWidth, padding: 10*unitWidth}}>
                    <Text>查询状态:</Text>
                    <AutoTextInput
                        placeholder={'请输入'}
                        value={this.state.InputString}
                        onChangeText={(text)=>{this.setState({InputString: text})}}
                        style={{width: 280*unitWidth, marginLeft: 5*unitWidth, textAlignVertical: 'center'}}
                    />
                </View>
                <FlatList
                    extraData={this.state}
                    renderItem={this._renderItem.bind(this)}
                    data={this.state.data}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={()=><View style={{height: 1, backgroundColor: '#F4F4F4'}}/>}
                />
            </View>
        )
    }
    _renderItem({item}){
        return (
            <TouchableOpacity activeOpacity={.5} onPress={this._clickCellAction.bind(this, item)}>
                <View
                    style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center', marginLeft: 10*unitWidth,
                        justifyContent: 'space-between'}}>
                    <Text>{item.name}</Text>
                    {item.select === true? <Image source={require('../Images/select_right.png')}
                                                  style={{height: 15*unitWidth, width: 15*unitWidth, marginRight: 10*unitWidth}}/>:null}
                </View>
            </TouchableOpacity>

        )
    }
    _clickCellAction(item){
        let arr = [];
        arr = arr.concat(this.state.data);
        arr.map((i)=>{
            if (i.name === item.name){
                i.select = !item.select;
            }
            //单选
            if(!this.multipeSelect){
                if(i.name !== item.name){
                    i.select = false
                }
            }
        });
        this.setState({data: arr});
    }

}
