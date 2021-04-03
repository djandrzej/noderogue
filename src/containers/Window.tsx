import React from 'react';
import { connect } from 'react-redux';

class Window extends React.Component<{ content: string }> {
  render(): JSX.Element {
    const { content } = this.props;
    return (
      <blessed-box
        top={1}
        left={1}
        width="100%-1"
        height="100%-1"
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
