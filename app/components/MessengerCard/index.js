/**
*
* MatchMessengerBlock
*
*/

import React, { PropTypes } from 'react';
import { parsePingTime } from 'utils/operations';

import Text from 'components/Text';
import styles from './styles.css';
import Icon from 'components/Icon';

const MessengerCard = ({ data, onClick, isNew, isReply }) => {
  const person = data.person;
  const recentActivity = parsePingTime(data.last_activity_date, false);
  const messages = data.messages;
  const recentMessage = messages && messages[messages.length - 1] && messages[messages.length - 1].message;
  if (person) {
    return (
      <div onClick={() => onClick(person._id)} className={styles.matchBlock}>
        <div className={styles.matchAvatarContainer}>
          <div
            className={styles.matchAvatar}
            style={{
              backgroundImage: `url(${person && person.photos.length !== 0 && person.photos[0].processedFiles && person.photos[0].processedFiles[2].url})`,
              backgroundColor: 'lightgrey',
            }}
          />
        </div>
        <div className={styles.matchDetails}>
          <div className={styles.flexName}>
            <Text type="matchName">{person && person.name} {isNew ? <div className={styles.newDot} /> : null} </Text>
            <Text type="matchActivity">{recentActivity}</Text>
          </div>
          {recentMessage ? <Text
            type="matchRecentMessage"
          >
          {isReply ? <Icon
            type="replyArrow"
            style={{ width: 15, height: 15, marginRight: 5, fill: 'grey' }}
            viewBox="0 0 30 30"
          /> : null}
          {recentMessage.slice(0, 50)}
          </Text> : null}
        </div>
      </div>
    );
  }
  return null;
};

MessengerCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  isReply: PropTypes.bool,
};

export default MessengerCard;
