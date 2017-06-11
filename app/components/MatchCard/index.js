import React, { PropTypes } from 'react';
import { getAge, convertDistanceToLocal } from 'utils/operations';

import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

const buttonMapping = [
  'pass', 'superlike', 'like',
];


const MatchCard = ({ data, type, onClick, onClickButton }) => {
  const bioText = (data.bio && data.bio.trim()) ?
    <p className={styles.matchCardContainer_bio}>{data.bio}</p> :
  null;
  const ageText = (
    <Text type="age">{getAge(data.birth_date)}
      <Text type="distance">
        {convertDistanceToLocal(data.distance_mi)} km away
      </Text>
    </Text>);
  const schoolText = (data.schools[0] && data.schools[0].name) ? <Text type="detail">{data.schools[0].name}</Text> : null;

  const detailDiv = (schoolText || bioText) ?
    <div className={styles.matchCardContainer_hide}>
      {/* {bioText} */}
      <div className={styles.matchCardContainer_details}>
        {schoolText}
      </div>
    </div> : null;

  /* eslint-disable no-underscore-dangle */
  return (
    <div
      className={type === 'active' ? `${styles.matchCardLike} ${styles.matchCard}` : styles.matchCard}
      style={{
        backgroundImage: `url(${data.photos[0].url})`,
      }}
      id={`matchCard_${data._id}`}
    >
      <div className={styles.matchCardContainer}>
        <div className={styles.matchCardButtons}>
          {buttonMapping.map((each) => <Button key={each} type={each} details={{ name: data.name }} onClick={onClickButton} id={data._id} hash={data.content_hash}></Button>)}
        </div>
        <div
          className={styles.matchCardContainer_wrapper}
          onClick={() => {
            onClick(data._id, data.photos[0].url);
          }}
        >
          {ageText}
          <Text type="name">
            {data.name}
          </Text>
          {detailDiv}
        </div>
      </div>
    </div>
  );
  /* eslint-enable no-underscore-dangle */
};

MatchCard.propTypes = {
  onClickButton: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  tab_index: PropTypes.number,
  type: PropTypes.string,
};


export default MatchCard;

