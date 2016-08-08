import React from 'react';
import styles from './styles.css';

const buttonStyleMapping = {
};

class Button extends React.Component {
  render() {
    return (
      <button
        className={styles.button}
      >
        {this.props.children}
      </button>);
  }
}

export default Button;