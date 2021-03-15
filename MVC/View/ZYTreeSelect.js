import React from 'react';
import {Text, TouchableOpacity, FlatList, View, StyleSheet, Image} from "react-native";
import {unitHeight, unitWidth} from "../Tools/ScreenAdaptation";

export default class ZYTreeSelect extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '请选择',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'确定'}</Text>
        </TouchableOpacity>)
    });
    constructor(props){
        super(props);
        this.state = {
            data: [],
            iTableArr: [],
        }
    }

    _ClickHeaderRightAction = () => {
        let arr = [].concat(this.state.iTableArr);
        let ids = [];
        let names = [];
        for (let i=0; i<arr.length; i++){
            let one = arr[i];
            if (one.deptUserList) {
                for (let j=0; j<one.deptUserList.length; j++){
                    let two = one.deptUserList[j];
                    if (two.userList) {
                        for (let k=0; k<two.userList.length; k++){
                            if (arr[i].deptUserList[j].userList[k]['isSelect'] === true) {
                                ids.push(arr[i].deptUserList[j].userList[k]['id']);
                                names.push(arr[i].deptUserList[j].userList[k]['name']);
                            }
                        }
                    }
                }
            }
        }
        this.props.navigation.state.params.callback(ids, names);
        this.props.navigation.goBack();
    };

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        let data = navigation.getParam('data');

        for (let i=0; i<data.length; i++){
            let one = data[i];
            data[i]['level'] = 0;
            data[i]['isSelect'] = false;
            for (let j=0; j<one.deptUserList.length; j++){
                let two = one.deptUserList[j];
                data[i].deptUserList[j]['level'] = 1;
                data[i].deptUserList[j]['isSelect'] = false;
                for (let k=0; k<two.userList.length; k++){
                    data[i].deptUserList[j].userList[k]['level'] = 2;
                    data[i].deptUserList[j].userList[k]['isSelect'] = false;
                }
            }
        }
        this.setState({ iTableArr: data, data: data });
    }
    render(): React.ReactNode {
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.iTableArr}
                    extraData={this.state}
                    keyExtractor={(item, index)=>index.toString()}
                    renderItem={this._renderItemAction.bind(this)}
                    ItemSeparatorComponent={this._itemSeparatorComponent.bind(this)}
                />
            </View>
        )
    }
    _renderItemAction({item, index}) {
        return (
            <TouchableOpacity onPress={()=>{this._clickItemAction(item)}}>
                <View style={{
                    flexDirection: 'row', height: 54*unitWidth, alignItems: 'center', padding: 10*unitWidth,
                    marginLeft: item.level * 50 *unitWidth, justifyContent: 'space-between'
                }}>
                    <Text style={{fontSize: 14*unitWidth}}>{item.level !== 2 ? item.deptName : item.name}</Text>
                    {
                        item.isSelect && item.level === 2 ? <Image
                            source={require('../Images/select_right.png')}
                            style={{width: 20*unitWidth, height: 20*unitWidth}}
                        >
                        </Image> : null
                    }
                </View>
            </TouchableOpacity>
        )
    }
    _itemSeparatorComponent = () => {
        return (
            <View style={{height: unitHeight, backgroundColor: '#DCDCDC'}}>

            </View>
        )
    };
    _clickItemAction(item) {
        if (item.level === 0) {
            if (item.isSelect === false) {
                item.isSelect = true;
                let arr1 = [];
                let arr2 = [];
                arr1 = arr1.concat(this.state.iTableArr);
                arr2 = arr2.concat(item.deptUserList);
                let loc = arr1.indexOf(item) + 1;
                arr2.unshift(loc, 0);
                Array.prototype.splice.apply(arr1, arr2);
                this.setState({ iTableArr: arr1 })
            } else {
                item.isSelect = false;
                let arr1 = [];
                let arr2 = [];
                arr1 = arr1.concat(this.state.iTableArr);
                arr2 = arr2.concat(item.deptUserList);
                for (let i=0; i<arr1.length; i++) {
                    for (let j=0; j<arr2.length; j++) {
                        if (arr1[i].deptName === arr2[j].deptName) {
                            arr1.splice(i, 1);
                        }
                    }
                }
                this.setState({ iTableArr: arr1 })
            }
        } else if (item.level === 1) {
            if (item.isSelect === false) {
                item.isSelect = true;
                let arr1 = [];
                let arr2 = [];
                arr1 = arr1.concat(this.state.iTableArr);
                arr2 = arr2.concat(item.userList);
                let loc = arr1.indexOf(item) + 1;
                arr2.unshift(loc, 0);
                Array.prototype.splice.apply(arr1, arr2);
                console.log('arr1 = ', arr1);
                this.setState({ iTableArr: arr1 })
            } else {
                item.isSelect = false;
                let arr1 = [];
                let arr2 = [];
                arr1 = arr1.concat(this.state.iTableArr);
                arr2 = arr2.concat(item.userList);
                for (let i=0; i<arr1.length; i++) {
                    for (let j=0; j<arr2.length; j++) {
                        if (arr1[i].name === arr2[j].name) {
                            arr1.splice(i, 1);
                        }
                    }
                }
                console.log('arr1 = ', arr1);
                this.setState({ iTableArr: arr1 })
            }
        } else if (item.level === 2) {
            let arr1 = [].concat(this.state.iTableArr);
            if (item.isSelect) {
                item.isSelect = false;
            } else {
                item.isSelect = true;
            }
            this.setState({ iTableArr: arr1 });
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
