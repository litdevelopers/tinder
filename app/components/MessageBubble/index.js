/**
*
* MessageBubble
*
*/

import React, { PropTypes } from 'react';
import styles from './styles.css';
import Text from 'components/Text';

function MessageBubble(props) {
  return (
    <div className={styles[props.from]}>
      {props.children.match(/gif|giphy/) ? <span className={styles.messageContent}><img role="presentation" src={props.children} /></span> :
        <Text type="">{props.children}</Text>
      }
    </div>
  );
}

MessageBubble.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.string,
};

export default MessageBubble;
