import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {unitWidth} from "../Tools/ScreenAdaptation";
import AutoTextInput from '../Tools/AutoTextInput';
import TreeSelect from '../View/Tree/tree';

export default class EmpSelectList extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '请输入或选择',
        headerRight: (<TouchableOpacity activeOpacity={.5}
                                        onPress={()=>{navigation.state.params.rightOnPress()}}>
            <Text style={{color: '#fff', marginRight: 10*unitWidth}}>{'确定'}</Text>
        </TouchableOpacity>)
    });

    constructor(props){
        super(props);

        this.allData = []
        this.state = {
            treeData:null,
            isVisible: false,
            value: []
        }
    }

    componentDidMount(): void {
        this.props.navigation.setParams({rightOnPress: this._ClickHeaderRightAction});
        const {navigation} = this.props;
        let data = navigation.getParam('data')
        this.allData = data
        this.setState({
            treeData: data,
            value : navigation.getParam('value')
        })
    }

    filterData(text){
        if(text==undefined ||text==''){
            this.setState({
                treeData: this.allData,
            })
            return
        }
        let alldata  = this.state.treeData
        let tempData = []
        for(let i in alldata){
            let dept= alldata[i]
            let have = false
            let tempdept = JSON.parse(JSON.stringify(dept));
            tempdept.children = []

            for(let j in dept.children){
                let user = dept.children[j]
                if(user.label.indexOf(text)!= -1){
                    have = true
                    tempdept.children.push(user)
                }
            }
            if(have){
                tempData.push(tempdept)
            }
        }
        this.setState({
            treeData: tempData,
        })

    }

    _ClickHeaderRightAction = () => {
        const selectedValue = this.treeRef.getSelectValue();
        this.props.navigation.state.params.callback(selectedValue);
        this.props.navigation.goBack();
    };

    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <View
                    style={{flexDirection: 'row', height: 54*unitWidth, alignItems: 'center',
                        borderBottomColor:'#F4F4F4', borderBottomWidth: unitWidth, padding: 10*unitWidth}}>
                    <Text>接收人:</Text>
                    <AutoTextInput
                        placeholder={'请输入'}
                        value={this.state.InputString}
                        onChangeText={(text)=>{
                            this.filterData(text)
                        }}
                        style={{width: 280*unitWidth, marginLeft: 5*unitWidth, textAlignVertical: 'center'}}
                    />
                </View>

                <View  style={{flex: 1}}>
                    <TreeSelect
                        ref={node => this.treeRef = node}
                        onComfirm={(value) => {
                            this.setState({ value });
                        }}
                        value={this.state.value}
                        onlyCheckLeaf={true}
                        multiple={true}
                        treeData={this.state.treeData} />
                </View>
            </View>
        )
    }

}
