import React, { PropTypes } from 'react';
import Card from 'components/Card';
import styles from './styles.css';

export default function MatchCard(props) {
  return (
    <Card
      type="matchCard"
      style={{
        // backgroundImage: `url(${props.data.photos[0].url})`,
      }}
    >
      <div className={styles.matchCardContainer}>

      </div>
    </Card>
  );
}

MatchCard.PropTypes = {
  data: PropTypes.object.isRequired,
};