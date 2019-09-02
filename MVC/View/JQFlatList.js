import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import PropTypes from 'prop-types';
import {unitWidth} from "../Tools/ScreenAdaptation";

export default class JQFlatList extends React.Component{
    static defaultProps = {
        data: [],
        ItemSeparatorComponent: () => {
            return <View style={styles.baseLine}/>
        },
        ListEmptyComponent: () => {
            return (
                <View style={styles.noListView}>
                    <Text style={styles.NoListText}>这里空空如也~</Text>
                </View>
            );
        },
        refreshing: false,
        animating: true,
        ItemHeight: 50*unitWidth,
    };
    static propTypes = {
        data: PropTypes.array,
        keyExtractor: PropTypes.func,
        onEndReached: PropTypes.func,
        renderItem: PropTypes.func,
        ItemSeparatorComponent: PropTypes.func,
        ListEmptyComponent: PropTypes.func,
        ListFooterComponent: PropTypes.func,
        refreshing: PropTypes.bool,
        colors: PropTypes.array,
        progressBackgroundColor: PropTypes.string,
        onRefresh: PropTypes.func,
        animating: PropTypes.bool,
        nomore: PropTypes.bool,
        ItmeHeight: PropTypes.number,
    };
    constructor (props) {
        super (props);
    }
    _ListFooterComponent = () => {
        const {data, nomore, animating} = this.props;
        return (
            <View style={styles.bottomfoot}>
                {
                    data.length !== 0 ?
                        nomore ? (
                            <Text style={styles.footText}>- 我是有底线的 -</Text>
                        ) : (
                            <View style={styles.activeLoad}>
                                <ActivityIndicator size={'small'} animating={animating}/>
                                <Text style={[styles.footText, styles.ml]}>加载更多...</Text>
                            </View>
                        ) :null
                }
            </View>
        );
    };
    _renderItem = (item) => {
        return this.props.renderItem(item);
    };
    render(): React.ReactNode {
        const {
            data,
            keyExtractor,
            onEndReached,
            ItemSeparatorComponent,
            ListEmptyComponent,
            refreshing,
            colors,
            progressBackgroundColor,
            onRefresh,
        } = this.props;
        return (
            <FlatList data={data}
                      style={{height: (812-64)*unitWidth}}
                      keyExtractor={keyExtractor}
                      onEndReached={onEndReached}
                      refreshing={true}
                      renderItem={({item}) => this._renderItem(item)}
                      ItemSeparatorComponent={ItemSeparatorComponent}
                      ListEmptyComponent={ListEmptyComponent}
                      ListFooterComponent={this._ListFooterComponent}
                      onEndReachedThreshold={20*unitWidth}
                      refreshControl={
                          <RefreshControl
                              refreshing={refreshing}
                              colors={colors}
                              progressBackgroundColor={progressBackgroundColor}
                              onRefresh={onRefresh}
                          />
                      }
            />
        );
    }
}

const styles = StyleSheet.create({
    baseLine: {
        width: 100,
        height: 1,
        backgroundColor: '#eeeeee',
    },
    noListView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    NoListText: {
        marginTop: 15,
        fontSize: 18,
        color: '#999999',
    },
    bottomfoot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    footText: {
        marginTop: 5,
        fontSize: 12,
        color: '#999999',
    },
    activeLoad: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ml: {
        marginLeft: 10,
    },
});
