import React from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {unitWidth} from "../../Tools/ScreenAdaptation";
import OpenFile from "react-native-doc-viewer";
import RNFetchBlob from "rn-fetch-blob";

export default class PracticableLuoShi extends React.Component{
    static navigationOptions = {
        title: '落实情况',
    };
    render(): React.ReactNode {
        const {navigation} = this.props;
        let modal = navigation.getParam('LS');
        return(
            <View style={{flex: 1}}>
                <FlatList
                    renderItem={this._renderItem}
                    data={modal}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }
    _renderItem = ({item}) => {
        let progressStr = '';
        switch (item.progress) {
            case 1:
                progressStr = '完成';
                break;
            case 2:
                progressStr = '在办';
                break;
            case 3:
                progressStr = '未办';
                break;
        }
        return (
            <View style={styles.contain}>
                <View style={styles.viewStyle}>
                    <Text>{'添加时间: ' + item.createTime}</Text>
                    <Text>{'进展情况: ' + progressStr}</Text>
                </View>
                <Text numberOfLines={0}
                      style={styles.textStyle}>{'工作内容: ' + item.workContent}</Text>
                <Text numberOfLines={0}
                      style={styles.textStyle}>{'工作依据: ' + item.workGist}</Text>
                <Text numberOfLines={0}
                      style={styles.textStyle}>{'进展情况: ' + item.progressContent}</Text>
                <Text numberOfLines={0}
                      style={styles.textStyle}>{'备注: ' + item.memo}</Text>
                {
                    item.fileDTOList ? item.fileDTOList.map((i)=>{
                        return (
                            <View style={[styles.textStyle, {flexDirection: 'row', marginBottom: 5*unitWidth}]}>
                                <Text>附件:</Text>
                                <TouchableOpacity activeOpacity={.5} onPress={this._clickAttAction.bind(this, i)}>
                                    <Text style={{color: 'blue', marginLeft: 5*unitWidth}}>{i.name}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }) : null
                }

            </View>
        )
    };
    _clickAttAction = (i) =>{
        let urls = 'http://221.13.156.198:10008' + i.url;
        if (Platform.OS === 'ios') {
            OpenFile.openDoc([{
                url: urls,
                fileNameOptional: i.name
            }], (error, url)=>{

            })
        }else {
            let uriSuffix = i.url.substr(i.url.lastIndexOf(".")+1).toLowerCase();
            OpenFile.openDoc([{
                url: urls,
                fileName: i.name,
                fileType: uriSuffix,
                cache: true,
            }], (error, uri)=>{
            })
        }
    }
}

const styles = StyleSheet.create({
    contain: {
        marginTop: 5*unitWidth,
        marginBottom: 5*unitWidth,
        marginLeft: 10*unitWidth,
        marginRight: 10*unitWidth,
        borderWidth: unitWidth,
        borderColor: '#F4F4F4',
    },
    viewStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10*unitWidth,
        marginRight: 10*unitWidth,
        marginTop: 5*unitWidth,
    },
    textStyle: {
        marginLeft: 10*unitWidth,
        marginRight: 10*unitWidth,
        marginTop: 5*unitWidth,
    },
});
