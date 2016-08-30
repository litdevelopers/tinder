import React from 'react';
import Button from 'components/Button';
import Text from 'components/Text';
import styles from './styles.css';

import { parsePingTime } from 'utils/operations';

const buttonTypes = [
  {
    type: 'LIKE_PERSON',
    buttonText: 'like',
  },
  {
    type: 'PASS_PERSON',
    buttonText: 'pass',
  },
  {
    type: 'SUPERLIKE_PERSON',
    buttonText: 'superlike',
  },
];


const typeMapping = {
  LIKE_PERSON: (personName) => <Text type="historyAction">You <Text type="historyAction" style={{ fontWeight: 600}}>liked </Text>{personName}</Text>,
  SUPERLIKE_PERSON: (personName) => <Text type="historyAction">You <Text type="historyAction" style={{ fontWeight: 600}}>superliked </Text>{personName}</Text>,
  PASS_PERSON: (personName) => <Text type="historyAction">You <Text type="historyAction" style={{ fontWeight: 600}}>passed </Text>on {personName}</Text>,
  NEW_MATCH: (personName) => <Text type="historyAction">You <Text type="historyAction" style={{ fontWeight: 600}}>matched </Text>with {personName}</Text>,
};

function renderText(type, details) {
  return typeMapping[type](details.name);
}

function renderDate({ date }) {
  return parsePingTime(date, false);
}

const HistoryEntry = ({ data, onClickButton }) => {
  return (
    <li className={styles.historyEntryContainer}>
      <div className={styles.historyEntryContainerContent}>
        <div className={styles.textContainer}>
          <Text type="historyAction">{renderText(data.type, data.details)}</Text>
          <Text type="historyDate">{renderDate(data.details)}</Text>
        </div>
        <div className={styles.buttonsContainer}>
        {data.type !== 'NEW_MATCH' && buttonTypes.map((each) => {
          if (each.type !== data.type) {
            return (
              <Button
                onClick={() => {
                  onClickButton(data.id, data.hash, data.details, each.buttonText);
                }}
                key={`${data.id}_${each.type}`}
                type="text"
              >
                <Text
                  type="buttonText"
                  style={{ textTransform: 'capitalize' }}
                >
                  {each.buttonText}
                </Text>
              </Button>);
          }
        })}
        </div>
      </div>
    </li>
  );
};

HistoryEntry.propTypes = {
  data: React.PropTypes.object,
  onClickButton: React.PropTypes.func,
};


export default HistoryEntry;
