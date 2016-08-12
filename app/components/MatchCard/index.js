import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';

import { getAge } from './helpers';
import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

const matchCardSource = {
  beginDrag(props) {
    return {
      data: props.data,
      onClickButton: props.onClickButton,
      onClick: props.onClick,
      opacity: 1,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}


class MatchCard extends React.Component {
  render() {
    const { data, opacity, connectDragSource, isDragging } = this.props;
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
    
    return connectDragSource(
      <div
        className={styles.matchCard}
        style={{
          backgroundImage: `url(${data.photos[0].url})`,
          opacity: isDragging ? 0 : opacity,
        }}
        id={`matchCard_${data._id}`}
      >
        <div className={styles.matchCardContainer}>
          <div className={styles.matchCardButtons}>
            <Button type="like" onClick={this.props.onClickButton} id={data._id}>Like</Button>
            <Button type="superlike" onClick={this.props.onClickButton} id={data._id}>Super Like</Button>
            <Button type="pass" onClick={this.props.onClickButton} id={data._id}>Pass</Button>
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
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  opacity: PropTypes.number,
};


export default DragSource('matchCard', matchCardSource, collect)(MatchCard) ;

