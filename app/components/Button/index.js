import React, { PropTypes } from 'react';
import styles from './styles.css';

class Button extends React.Component {
  render() {
    return (
      <button
        className={styles[this.props.type]}
        onClick={() => {
          this.props.onClick(this.props.id, this.props.type);
        }}
      >
        {this.props.children}
      </button>);
  }
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Button;
