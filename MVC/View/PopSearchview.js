import React from 'react';
import {Text, TouchableOpacity, View, KeyboardAvoidingView} from 'react-native';
import PopSearch from '../View/PopSearch'
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import PropTypes from 'prop-types'
import JQDatePicker from '../View/JQDatePicker'
import JQSingleInput from '../View/JQSingleInput'
import JQActionSheet from '../View/JQActionSheet'
import JQJumpTo from '../View/JQJumpTo'
import {unitWidth} from "../Tools/ScreenAdaptation";

/**
 * @param type 组件类型，详情见下方123456789
 *
 * @param name 组件左标题
 *
 * 1.时间选择器             JQDatePicker
 * 2.单行输入               JQSingleInput
 * 3.跳转到界面多选           JQJumpTo
 * 4.状态选择框              JQActionSheet
 * 5.
 * 6.
 * 7.
 * 8.
 * 9.
 */

export default class PopSearchview extends React.Component{
    static propTypes = {
        dataSource: PropTypes.array.isRequired,
        callback: PropTypes.func,
    };

    constructor (props){
        super (props);
        this.state = {
            searchInfo: [],
            jumpToArr: [],  // 跳转类型的值
        }
    }
    _show(){
        this.popSearch.show();
    }
    _addSearchInfo(info){
        console.log(info);
        let map = [];
        map = map.concat(this.state.searchInfo);

        if (this._isInclude(info, map)){
            map.map((i)=>{
                if (i.title === info.title){
                    RRCToast.show('22');
                    i = info;
                }
            });
        } else {
            RRCToast.show('11');
            map.push(info);
        }

        this.setState({
            searchInfo: map,
        })
    }

    _isInclude = (info, arr) => {
        let value= info.title;
        for (let i=0;i<arr.length;i++){
            if(info){
                if(arr[i]){
                    var value1 = arr[i].title;
                    if(value === value1){
                        return true;
                    }
                }
            }
        }
        return false;
    };
    render(): React.ReactNode {
        return (
            <PopSearch modalBoxHeight={54*this.props.dataSource.length+54}
                ref={ref => this.popSearch = ref}>
                {this.props.dataSource.map((i)=>{
                    if (i.type === 1){
                        return <JQDatePicker key={i.name}
                                             leftTitle={i.name}
                                             postKeyName={i.postKeyName}
                                             postKeyNameEnd={i.postKeyNameEnd}
                                             callBack={this._addSearchInfo.bind(this)}/>
                    }
                    if (i.type === 2){
                        return <JQSingleInput key={i.name}
                                              leftTitle={i.name}
                                              postKeyName={i.postKeyName}
                                              callBack={this._addSearchInfo.bind(this)}/>
                    }
                    if (i.type === 3){
                        return <JQJumpTo key={i.name}
                                         leftTitle={i.name}
                                         dataSource={i.dataSource}
                                         postKeyName={i.postKeyName}
                                         callBack={this._addSearchInfo.bind(this)}/>
                    }
                    if (i.type === 4){

                    }
                    if (i.type === 5){

                    }
                    if (i.type === 6){

                    }
                    if (i.type === 7){

                    }
                })}
                <View style={{height: 54*unitWidth}}>
                    <TouchableOpacity activeOpacity={.5} onPress={this._screen.bind(this)}>
                        <View style={{backgroundColor: '#38ADFF', alignItems: 'center', justifyContent: 'center',
                            height: 54*unitWidth, width: 375*unitWidth}}>
                            <Text style={{fontSize:16*unitWidth, color:'#fff', fontWeight: 'bold'}}>筛选</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </PopSearch>
        )
    }
    _screen(){
        console.log(this.state.searchInfo);
    }
}
