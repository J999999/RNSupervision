import React from 'react';
import {StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions} from 'react-native';
import {unitWidth} from "../Tools/ScreenAdaptation";
import {RRCAlert, RRCToast} from "react-native-overlayer/src";
import {Header} from 'react-navigation'

const {width, height} = Dimensions.get('window');
export default class PopSearch extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            offset: new Animated.Value(0),
            show: false,
        }
    }

    in(){
        Animated.timing(
            this.state.offset,
            {
                easing: Easing.linear,
                duration: 300,
                toValue: 1
            }
        ).start()
    }

    out(){
        Animated.timing(
            this.state.offset,
            {
                easing: Easing.linear,
                duration: 300,
                toValue: 0
            }
        ).start();
        setTimeout(() => this.setState({show: false}),300)
    }

    show(){
        this.setState({
            show: true
        }, this.in())
    }

    hide(){
        this.out()
    }

    defaultHide(){
        this.props.hide();
        this.out()
    }

    render(): React.ReactNode {
        let {transparentIsClick, modalBoxBg, modalBoxHeight} = this.props;
        RRCAlert.alert('height='+height+'******'+height - modalBoxHeight*unitWidth - Header.HEIGHT - 20);
        if (this.state.show) {
            return (
                <View style={[styles.container, { height: height }]}>
                    <TouchableOpacity style={{ height: height - modalBoxHeight }}
                                      onPress={transparentIsClick && this.defaultHide.bind(this)}>
                    </TouchableOpacity>
                    <Animated.View
                        style={[styles.modalBox, {
                            height: height, top: 0, backgroundColor: modalBoxBg,
                            transform: [{
                                translateY: this.state.offset.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [height, height - modalBoxHeight*unitWidth - Header.HEIGHT - 20]
                                }),
                            }]
                        }]}>
                        {this.props.children}
                    </Animated.View>
                </View>
            )
        }
        return <View />
    }
}

const styles = StyleSheet.create({
    container: {
        width: width,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        position: 'absolute',
        top: 0,
        zIndex: 9,
        left: 0,
        bottom: 0,
        flex :1,
    },
    modalBox: {
        position: 'absolute',
        width: width
    }
});

PopSearch.defaultProps = {
    modalBoxHeight: 300, // 盒子高度
    modalBoxBg: '#fff', // 背景色
    hide: function () { }, // 关闭时的回调函数
    transparentIsClick: true  // 透明区域是否可以点击
};
