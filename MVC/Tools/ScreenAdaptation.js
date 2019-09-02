import {Dimensions, StatusBar, Platform, PixelRatio} from 'react-native'

//UI设计图的宽度/高度
const designWidth = 375; //750
const designHeight = 812; //1334

//手机屏幕的宽度/高度
export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

//计算手机屏幕宽度对应设计图宽度的单位宽度(手机屏幕和设计图宽度比)
export const unitWidth = screenWidth / designWidth;
//计算手机屏幕高度对应设计图高度的单位高度(手机屏幕和设计图高度比)
export const unitHeight = screenHeight / designHeight;

export const statusBarHeight = getStatusBarHeight();
export const safeAreaViewHeight = isIphoneX() ? 34 : 0;

//标题栏高度
export const titleHeight = unitWidth * 100 + statusBarHeight;

//字体缩放比例
//当前应用中的字体需要根基手机设置中字体大小改变的话，需要用到缩放比例
export const fontScale = PixelRatio.getFontScale();

/**
 * 判断是否为 iPhoneX
 * @returns {boolean}
 */
export function isIphoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return Platform.OS === 'ios' && (screenHeight === X_HEIGHT && screenWidth === X_WIDTH);
}
//状态栏高度
export function getStatusBarHeight() {
    if (Platform.OS === 'android')
        return StatusBar.currentHeight;
    if (isIphoneX()){
        return 44;
    }
    return 20;
}
