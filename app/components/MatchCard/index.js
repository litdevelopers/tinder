import React, { PropTypes } from 'react';
import { getAge } from './helpers';
import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

class MatchCard extends React.Component {

  render() {
    const { data } = this.props;
    const bioText = (data.bio.trim()) ?
      <p className={styles.matchCardContainer_bio}>{data.bio}</p> :
    null;
    const ageText = (
      <Text type="age">{getAge(data.birth_date)}
        <Text type="distance">
          {data.distance_mi} miles away
        </Text>
      </Text>);
    const schoolText = (data.schools[0] && data.schools[0].name) ? <Text type="detail">{data.schools[0].name}</Text> : null;

    const detailDiv = (schoolText || bioText) ?
      <div className={styles.matchCardContainer_hide}>
      {bioText}
        <div className={styles.matchCardContainer_details}>
          {schoolText}
        </div>
      </div> : null;

    return (
      <div
        className={styles.matchCard}
        style={{
          backgroundImage: `url(${data.photos[0].url})`,
        }}
        id={`matchCard_${data._id}`}
      >
        <div className={styles.matchCardContainer}>
          <div className={styles.matchCardButtons}>
            <Button type="like" onClick={this.props.onClickButton} id={data._id}>Like</Button>
            <Button type="pass" onClick={this.props.onClickButton} id={data._id}>Pass</Button>
            <Button type="superlike" onClick={this.props.onClickButton} id={data._id}>Super Like</Button>
          </div>
          <div
            className={styles.matchCardContainer_wrapper}
            onClick={() => {
              this.props.onClick(data._id, data.photos[0].url);
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
  }
}

MatchCard.propTypes = {
  onClickButton: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};


export default MatchCard;

