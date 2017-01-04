import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import blessed from 'blessed';

@connect(state => ({
    content: state
}))
export default class Window extends Component {

    static propTypes = {
        content: PropTypes.string.isRequired
    };

    render() {
        const {content} = this.props;
        return (
            <box ref="box"
                 top={1}
                 left={1}
                 width="100%-1"
                 height="100%-1"
                 style={{
                     bg: 'black'
                 }}>
                {content}
            </box>
        );
    }

}
