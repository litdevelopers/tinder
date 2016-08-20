/**
*
* MatchMessengerBlock
*
*/

import React, { PropTypes } from 'react';
import { parsePingTime } from 'utils/operations';

import Text from 'components/Text';
import styles from './styles.css';

function MessengerCard(props) {
  const person = props.data.person;
  const recentActivity = parsePingTime(props.data.last_activity_date, false);
  const messages = props.data.messages;
  const recentMessage = messages && messages[messages.length - 1] && messages[messages.length - 1].message;

  if (person) {
    return (
      <div onClick={() => props.onClick(person._id)} className={styles.matchBlock}>
        <div className={styles.matchAvatarContainer}>
          <div
            className={styles.matchAvatar}
            style={{
              backgroundImage: `url(${person && person.photos && person.photos[0].processedFiles[0].url})`,
            }}
          />
        </div>
        <div className={styles.matchDetails}>
          <div className={styles.flexName}>
            <Text type="matchName">{person && person.name} {props.isNew ? <div className={styles.newDot} /> : null} </Text>
            <Text type="matchActivity">{recentActivity}</Text>
          </div>
          {recentMessage ? <Text type="matchRecentMessage">{recentMessage.slice(0, 50)}</Text> : null}
        </div>
      </div>
    );
  }
  return null;
}

MessengerCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
};

export default MessengerCard;
