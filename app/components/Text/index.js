import React, { PropTypes } from 'react';
import styles from './styles.css';

class Text extends React.Component {
  render() {
    return (<span {...this.props} className={styles[this.props.type]}>{this.props.children}</span>);
  }
}

Text.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Text;
