/**
*
* MessageBubble
*
*/

import React, { PropTypes } from 'react';
import styles from './styles.css';
import Text from 'components/Text';
import { parsePingTime } from 'utils/operations';

function MessageBubble(props) {
  return (
    <div className={styles[props.from]}>
      {props.children.match(/gif|giphy/) ? <span className={styles.messageContent}><img role="presentation" src={props.children} /></span> :
        <Text type="">{props.children}</Text>
      }
      <span className={styles.messageDate}>{parsePingTime(props.date, false)}</span>
    </div>
  );
}

MessageBubble.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.string,
  date: PropTypes.string,
};

export default MessageBubble;
