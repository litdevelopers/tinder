import React, { PropTypes } from 'react';

import { getAge } from './helpers';
import Card from 'components/Card';
import styles from './styles.css';

export default function MatchCard({ data }) {
  const bioText = (data.bio) ?
    <p className={styles.matchCardContainer_bio}>{data.bio}</p> :
    null;
  const ageText = <p className={styles.matchCardContainer_age}>{getAge(data.birth_date)}</p>;
  const schoolText = (data.schools[0] && data.schools[0].name) ? <span className={styles.matchCardContainer_detail}>{data.schools[0].name}</span> : null;

  const detailDiv = (schoolText) ?
  (<div className={styles.matchCardContainer_details}>
    {schoolText}
  </div>) : null;

  return (
    <Card
      type="matchCard"
      style={{
        backgroundImage: `url(${data.photos[0].url})`,
      }}
    >
      <div className={styles.matchCardContainer}>
        {ageText}
        <h2 className={styles.matchCardContainer_name}>
          {data.name}
          <span className={styles.matchCardContainer_distance}>
            {data.distance_mi} miles away
          </span>
        </h2>
        {bioText}
        {detailDiv}
      </div>
    </Card>
  );
}

MatchCard.PropTypes = {
  data: PropTypes.object.isRequired,
};
