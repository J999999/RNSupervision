import React from 'react';
import {
    Platform,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableNativeFeedback,
    Image,
} from 'react-native';
const TochableFeedback = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
const checkIconNames = [require('../../Images/icon_uncheck.png'), require('../../Images/minus-square.png'), require('../../Images/icon_checked.png')];

export default class TreeNode extends React.Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.check !== this.props.check
            || nextProps.expanded !== this.props.expanded;
    }

    render() {
        const {
            check, expanded, onExpand, onSelect, multiple, onlyCheckLeaf, predecessorsCount,
            nodeData, nodeData: { key, label, children },
        } = this.props;
        const Tochable = hasChildren ? TouchableWithoutFeedback : TochableFeedback;
        const hasChildren = !!children;
        const checkable = multiple || !onlyCheckLeaf || onlyCheckLeaf && !hasChildren;

        return (
            <View style={[
                styles.container,
                { paddingLeft: predecessorsCount * 10 },
                !hasChildren && { backgroundColor: 'rgb(240,240,240)' },
            ]}>
                <Tochable
                    onPress={() => checkable && onSelect(nodeData, check)}
                    style={styles.tochable}>
                    <View style={styles.icons}>
                        {hasChildren && <Image
                            source={expanded ? require('../../Images/item-up.png') : require('../../Images/item-down.png')}
                            style={styles.caretIcon}
                           />}
                        {checkable && <Image
                            source={checkIconNames[check || 0] }
                            style={styles.checkIcon} />}
                        <Text style={styles.label}>{label}</Text>
                    </View>
                </Tochable>
                {hasChildren &&
                <TouchableOpacity onPress={() => hasChildren && onExpand(key, expanded)}>
                    <Image
                        source={expanded ? require('../../Images/arrow-up.png') : require('../../Images/arrow-down.png')}
                        style={styles.chevronIcon} />
                </TouchableOpacity>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    icons: {
        paddingLeft: 8,
        flex: 1,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        width: 20,
        height:20,
        marginLeft: 6,
        marginRight: 6,
    },
    tochable: {
        flex: 1,
    },
    label: {
        paddingLeft: 0,
    },
    caretIcon: {
        width: 16,
        height:16,
    },
    chevronIcon: {
        padding: 10,
        width:16,
        height:16,
        marginRight: 10,
    },
});
