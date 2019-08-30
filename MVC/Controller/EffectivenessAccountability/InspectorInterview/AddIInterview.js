import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import JQSingleInput from '../../../View/JQSingleInput'
import {RRCToast} from "react-native-overlayer/src";

export default class AddIInterview extends React.Component{
    static navigationOptions = ({navigation}) => ({
        title: '新增督查约谈',
    });
    constructor (props) {
        super(props);
        this.state = {
            number: '',              // 编号  文本输入框，必填。
            attachment: [],          // 附件  非必填
            submitPeople: '',        // 提交人     文本输入框，必填。
            keyword: '',             // 关键字     文本输入框，必填。
            interviewPeople: '',     // 约谈对象    文本输入框，必填。
            interviewContent: '',    // 约谈内容    文本输入框，必填。
            interviewResult: '',     // 办理结果    文本输入框，必填。
            submitDepartment: '',    // 提交科室    文本输入框，必填。
            submitTime: '',          // 提交时间    日期选择框，必填。
            finishTime: '',          // 约谈完成时间  日期选择框，非必填。（ 不填，提请发布审核框不可选 ）
        };
    }

    render(): React.ReactNode {
        return (
            <KeyboardAwareScrollView>
                <JQSingleInput leftTitle={'编号'} callBack={this._saveValue.bind(this)}/>
                <JQSingleInput leftTitle={'事项来源'} callBack={this._saveValue.bind(this)}/>
            </KeyboardAwareScrollView>
        )
    }
    _saveValue = (modal) => {
        RRCToast.show(JSON.stringify(modal));
    }
}

const styles = StyleSheet.create({
    contain:{
        flex: 1,
    },
});
