import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import TextInputWidget from "../../Widget/TextInputWidget";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {screenWidth, unitWidth} from "../../Tools/ScreenAdaptation";

var max;
var min;
export default class PreviewSetupDetail extends React.Component{
    static navigationOptions = {
        title: '设置加分项'
    };
    constructor () {
        super ();
        this.state = {
            plusesName: '',
            maxScore: '',
            minScore: '',
        }
    }
    componentDidMount(): void {
        let item = this.props.navigation.getParam('item');
        max = item.maxScore;
        min = item.minScore;
        this.setState({
            plusesName: item.plusesName,
            minScore: item.minScore,
            maxScore: item.maxScore,
        })
    }

    render(): React.ReactNode {
        return (
            <View style={{flex: 1}}>
                <TextInputWidget  value={this.state.plusesName}  title='加分项名称:'  placeholder='请输入加分项名称' onChangeText={(text)=>{
                    this.setState({plusesName: text});
                }}/>
                <TextInputWidget  value={this.state.minScore.toString()}  title='最小值:'  placeholder='请输入最小值' onChangeText={(text)=>{
                    const newText = text.replace(/[^\d]+/, '');
                    let xx = '';
                    if (newText > max) {
                        RRCToast.show('分值有误，请重新输入...');
                    } else {
                        xx = newText;
                    }
                    this.setState({minScore: xx});
                }}/>
                <TextInputWidget  value={this.state.maxScore.toString()}  title='最大值:'  placeholder='请输入最大值' onChangeText={(text)=>{
                    const newText = text.replace(/[^\d]+/, '');
                    let xx = '';
                    if (newText < min) {
                        RRCToast.show('分值有误，请重新输入...');
                    } else {
                        xx = newText;
                    }
                    this.setState({maxScore: xx});
                }}/>
                <TouchableOpacity style={{margin: 10*unitWidth, alignItems:'flex-end',
                    width:screenWidth-16*unitWidth,}} onPress={this._onSave.bind(this)}>
                    <Text style={{fontSize:18*unitWidth, color:'#FFF', padding:12*unitWidth, textAlign:'center',
                        alignSelf:'stretch', backgroundColor:'#6CBAFF', borderRadius:5*unitWidth,}}>
                        {'确定'}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    _onSave = () => {
        let requestData = {};
        requestData['plusesName'] = this.state.plusesName;
        requestData['minScore'] = this.state.minScore;
        requestData['maxScore'] = this.state.maxScore;

        this.props.navigation.state.params.callback(requestData);
        this.props.navigation.goBack();
    }
}
