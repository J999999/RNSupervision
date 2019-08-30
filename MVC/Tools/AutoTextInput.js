import React,{Component} from 'react';
import {Platform, TextInput} from 'react-native';
import {unitWidth} from "./ScreenAdaptation";
export default class AutoTextInput extends Component {
    constructor(props) {
        super(props);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.state = {
            height: 0,
        };
    }

    onContentSizeChange(event) {
        let height = event.nativeEvent.contentSize.height;
        this.changeHeight(height);
    }

    onChange(event) {
        if (Platform.OS === 'android') {
            let height = event.nativeEvent.contentSize.height;
            this.changeHeight(height);
        }
    }

    changeHeight(height) {
        let {
            minHeight = 26*unitWidth,
            maxHeight,
        } = this.props;
        if (height < minHeight) {
            height = minHeight;
        } else if (maxHeight && height > maxHeight) {
            height = maxHeight;
        }
        if (height !== this.state.height) {
            this.setState({height: height});
        }
    }

    render() {
        return (
            <TextInput
                {...this.props}
                multiline
                onContentSizeChange={this.onContentSizeChange}
                onChange={this.onChange}
                style={[this.props.style, {height: this.state.height}]}
            />
        )
    }
}
