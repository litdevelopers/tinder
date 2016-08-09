import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';

import { getAge } from 'components/MatchCard/helpers';

import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

class DetailView extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.imageData && this.props.imageData[0].original !== nextProps.imageData[0].original) this.imageGallery.slideToIndex(0);
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.data) return true;
    if (this.props.data._id !== nextProps.data._id) return true;
    return false;
  }

  render() {
    if (!this.props.data || !this.props.imageData) return null;
    const age = getAge(this.props.data.birth_date);

    return (
      <div className={styles.detailViewContainer} >
        <div className={styles.detailViewContainer_mainPicture}>
          <ImageGallery
            ref={i => { this.imageGallery = i; }}
            defaultImage={this.props.data.photos[0].url}
            items={this.props.imageData}
            showBullets
            showThumbnails={false}
            showNav={false}
            startIndex={0}
            renderItem={(item) => <div style={{ backgroundImage: `url(${item.original})`, height: 400, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />}
          />
        </div>

        <div className={styles.detailViewContainer_content}>
          <Text
            type="name"
            style={{ color: 'black' }}
          >
            {this.props.data.name}
          </Text>
          <Text
            type="age"
            style={{ color: 'black' }}
          >
            , {age}
          </Text>
          <Text
            type="bio"
            style={{ color: 'black', display: 'block', fontSize: 12 }}
          >
            {this.props.data.bio}
          </Text>
        </div>
      </div>
    );
  }
}

DetailView.propTypes = {
  imageData: PropTypes.array,
  data: PropTypes.object,
};


export default DetailView;
