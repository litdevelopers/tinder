import React, { PropTypes } from 'react';
import { getAge } from './helpers';
import styles from './styles.css';
import Button from 'components/Button';

class MatchCard extends React.Component {
  render() {
    const { data } = this.props;
    const bioText = (data.bio.trim()) ?
      <p className={styles.matchCardContainer_bio}>{data.bio}</p> :
    null;
    const ageText = <p className={styles.matchCardContainer_age}>{getAge(data.birth_date)}</p>;
    const schoolText = (data.schools[0] && data.schools[0].name) ? <span className={styles.matchCardContainer_detail}>{data.schools[0].name}</span> : null;

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
              this.props.onClick(data._id);
            }}
          >
            {ageText}
            <h2 className={styles.matchCardContainer_name}>
              {data.name}
              <span className={styles.matchCardContainer_distance}>
                {data.distance_mi} miles away
              </span>
            </h2>
            {detailDiv}
          </div>
        </div>
      </div>
  );
  }
}

MatchCard.PropTypes = {
  onClick: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};


export default MatchCard;

