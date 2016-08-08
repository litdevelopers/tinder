import React, { PropTypes } from 'react';
import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

class DetailView extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (!this.props.data || !this.props.currentImage) return true;
    return this.props.currentImage !== nextProps.currentImage;
    return this.props.data._id !== nextProps.data._id; // eslint-disable-line react/prop-types, no-underscore-dangle
  }


  render() {
    if (!this.props.data) return null;
    return (
      <div className={styles.detailViewContainer} >
        <div
          className={styles.detailViewContainer_mainPicture}
          style={{
            backgroundImage: `url(${this.props.currentImage})`,
          }}
        />

        <div className={styles.detailViewContainer_subPictures}>
          {this.props.imageData.map((each) => {
            return (
              <div
                key={each}
                onClick={() => {
                  this.props.onClickImage(each);
                }}
                className={styles.detailViewContainer_subPictures_picture}
                style={{ backgroundImage: `url(${each})` }}
              />
            );
          })}
        </div>
        <div className={styles.detailViewContainer_content}>
          <p>Hello</p>
        </div>
      </div>
    );
  }
}

DetailView.PropTypes = {
  data: PropTypes.object.isRequired,
};


export default DetailView;

// <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>
