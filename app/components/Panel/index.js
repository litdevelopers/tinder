import React, { PropTypes } from 'react';
import styles from './styles.css';

import Text from 'components/Text';

import tinderCardFemale from 'static/tinder_female.png';
import tinderCardMale from 'static/tinder_male.png';

const placeholderMapping = {
  1: tinderCardFemale,
  0: tinderCardMale,
  '-1': tinderCardMale,
};


function renderPlaceholderMessage(isFetching, hasMatches) {
  if (isFetching) {
    return "Hold on, we're loading your recommendations!";
  }
  if (hasMatches) {
    return 'Pick a person to find out more information!';
  }
  return "We're having some trouble loading your recommendations. Check back again later!";
}

export default function Panels(props) {
  return (
    <div
      className={styles.detailView_placeholder}
    >
      <img src={placeholderMapping[props.targetGender]} role="presentation" style={{ maxHeight: 300, opacity: 0.5, alignSelf: 'center' }} />
      <Text type="placeholder">{renderPlaceholderMessage(props.isFetching, props.hasMatches)}</Text>
    </div>);
}

Panels.propTypes = {
  targetGender: PropTypes.number,
  type: PropTypes.string,
  hasMatches: PropTypes.bool,
  isFetching: PropTypes.bool,
};

