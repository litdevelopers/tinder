import React, { PropTypes } from 'react';
import styles from './styles.css';



function Card(props) {
  return (
    <div
      style={{ ...props.style }}
      className={styles[props.type]}
    >
      {props.children}
    </div>
  );
}

Card.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  margin: PropTypes.number,
  padding: PropTypes.number,
  flexNumber: PropTypes.number,
  styles: PropTypes.obj,
  children: PropTypes.node.isRequired,
};

export default Card;
