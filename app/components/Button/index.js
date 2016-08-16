import React, { PropTypes } from 'react';
import styles from './styles.css';

function Button(props) {
  return (
    <button
      className={styles[props.type]}
      onClick={() => {
        props.onClick(props.id, props.hash, props.type);
      }}
    >
      {props.children}
    </button>);
}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  hash: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

export default Button;
