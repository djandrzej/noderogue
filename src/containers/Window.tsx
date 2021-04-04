import React from 'react';
import { connect } from 'react-redux';

class Window extends React.Component<{ content: string }> {
  render(): JSX.Element {
    const { content } = this.props;
    return (
      <blessed-box
        top={0}
        left={0}
        width="100%"
        height="100%"
        style={{
          bg: 'black',
        }}
      >
        {content}
      </blessed-box>
    );
  }
}

export default connect((state) => ({
  content: state,
}))(Window);
