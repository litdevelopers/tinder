import React, { PropTypes } from 'react';
import ImageGallery from 'react-image-gallery';

import { getAge, parsePingTime } from 'utils/operations';
import { getFacebookUrl, getFacebookPicture } from 'utils/facebook';

import styles from './styles.css';
import Text from 'components/Text';

class DetailView extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.imageData && this.props.imageData[0].original !== nextProps.imageData[0].original) this.imageGallery.slideToIndex(0);
  }

  shouldComponentUpdate(nextProps) {
    if (!this.props.data) return true;
    if (this.props.data._id !== nextProps.data._id) return true; // eslint-disable-line no-underscore-dangle
    return false;
  }

  handleClickNext() {
    const nextIndex = this.imageGallery.getCurrentIndex() + 1;
    if (this.props.imageData[nextIndex]) {
      this.imageGallery.slideToIndex(nextIndex);
    } else {
      this.imageGallery.slideToIndex(0);
    }
  }

  render() {
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
            showThumbnails={false}
            showNav={false}
            startIndex={0}
            onClick={(e) => this.handleClickNext(e)}
            lazyLoad
            renderItem={(item) => <div key={item.original} style={{ backgroundImage: `url(${item.original})`, height: 400, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />}
          />
        </div>

        <div className={styles.detailViewContainer_content}>
          <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>
          <div>
          <Text type="age" style={{ color: 'black' }}>{age}</Text>
          <Text type="lastActive">{parsePingTime(this.props.data.ping_time)}</Text>
          </div>
          <Text type="school">{schools && schools.name}</Text>
          <Text type="jobs">{(jobs && jobs.title) && jobs.title.name}{(jobs && jobs.title) && jobs.company ? ' @ ' : null}{jobs && jobs.company && <a href={jobs.company.id} target="_blank">{jobs.company.name}</a>}</Text>
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
