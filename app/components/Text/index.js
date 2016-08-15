import React, { PropTypes } from 'react';
import styles from './styles.css';

function Text(props) {
  if (!props.children) {
    return null;
  } 
  return (<span {...props} className={styles[props.type]}>{props.children}</span>);
}

Text.propTypes = {
  type: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Text;
