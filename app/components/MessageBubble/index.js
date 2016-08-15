/**
*
* MessageBubble
*
*/

import React, { PropTypes } from 'react';


import styles from './styles.css';

function MessageBubble(props) {
  return (
    <div className={styles[props.from]}>
      <span className={styles.messageContent}>{props.children}</span>
    </div>
  );
}

MessageBubble.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.string,
};

export default MessageBubble;
