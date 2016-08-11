import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';
import tinderCardFemale from 'static/tinder_female.png';
import tinderCardMale from 'static/tinder_male.png';

import { getAge } from 'components/MatchCard/helpers';
import { getFacebookUrl, getFacebookPicture } from 'utils/facebook';

import styles from './styles.css';
import Text from 'components/Text';
import Button from 'components/Button';

const placeholderMapping = {
  1: tinderCardFemale,
  0: tinderCardMale,
};

const GENDER = 'FEMALE';

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
    if (!this.props.data || !this.props.imageData) {
      return (
        <div
          className={styles.detailView_placeholder}
        >
          <img src={placeholderMapping[this.props.targetGender]} role="presentation" style={{ maxHeight: 300, opacity: 0.5, alignSelf: 'center' }} />
          <Text type="placeholder">Pick a match to find out more!</Text>
        </div>);
    }

    const age = getAge(this.props.data.birth_date);
    const jobs = this.props.data.jobs[0];
    const schools = this.props.data.schools[0];

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
            renderItem={(item) => <div key={item.original} style={{ backgroundImage: `url(${item.original})`, height: 400, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />}
          />
        </div>

        <div className={styles.detailViewContainer_content}>
          <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>
          <Text type="age" style={{ color: 'black' }}>, {age}</Text>
          <Text type="school">{schools && schools.name}</Text>
          <Text type="jobs">{(jobs && jobs.title) && jobs.title.name}{(jobs && jobs.title) && jobs.company ? '@' : null}{jobs && jobs.company && jobs.company.name}</Text>
          <Text type="bio">{this.props.data.bio}</Text>
          {this.props.data.common_connections.length > 0 ?
            <div>
              <Text type="profileHeader">Common Connections</Text>
              <div className={styles.commonConnectionsContainer}>
            {this.props.data.common_connections.map((each) => {
              return (
                <div className={styles.connectionItem} key={each.id}>
                  <a
                    href={getFacebookUrl(each.id)}
                    target="_blank"
                  >
                    <div
                      key={each.id}
                      style={{ backgroundImage: `url(${getFacebookPicture(each.id)})` }}
                      className={styles.connectionImage}
                    />
                  </a>
                  <Text type="connectionName">{each.name || 'Friend'}</Text>
                </div>
              );
            })}
              </div>
            </div> : null}
          {this.props.data.common_interests.length > 0 ?
            <div className={styles.commonInterestsWrapper}>
              <Text type="profileHeader">Common Interests</Text>
              <div className={styles.commonInterestsContainer}>
                {this.props.data.common_interests.map((each) => {
                  return (
                    <a
                      key={each.id}
                      href={getFacebookUrl(each.id)}
                      target="_blank"
                      className={styles.commonInterestsLink}
                    >
                      <Text type="commonInterest">{each.name}</Text>
                    </a>
                  );
                })}
              </div>
            </div> : null}
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
