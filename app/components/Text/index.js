import React from 'react';
import styles from './styles.css';

class Text extends React.Component {
  render() {
    return (<span {...this.props} className={styles[this.props.type]}>{this.props.children}</span>);
  }
}

export default Text;
