import React, { PropTypes } from 'react';
import styles from './styles.css';

const Text = (props) => {
  if (!props.children) {
    return null;
  }
  return (<span {...props} className={styles[props.type]}>{props.children}</span>);
};

Text.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node,
};

export default Text;
