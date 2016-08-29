/**
*
* MessageBubble
*
*/

import React, { PropTypes } from 'react';
import styles from './styles.css';
import Text from 'components/Text';
import { parsePingTime } from 'utils/operations';

const MessageBubble = ({ from, children, date }) => (
  <div className={styles[from]}>
    {children.match(/media0|giphy/) ? <span className={styles.messageContent}><img role="presentation" style={{ maxWidth: 300, maxHeight: 300 }}src={children} /></span> :
      <Text type="">{children}</Text>
    }
    <span className={styles.messageDate}>{parsePingTime(date, false)}</span>
  </div>
);

MessageBubble.propTypes = {
  from: PropTypes.string.isRequired,
  children: PropTypes.string,
  date: PropTypes.string,
};

export default MessageBubble;
