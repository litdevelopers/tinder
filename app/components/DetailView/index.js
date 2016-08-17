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
    const jobs = this.props.data.jobs && this.props.data.jobs[0];
    const schools = this.props.data.jobs && this.props.data.schools[0];

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
          <circle cx="50" cy="50" r="11.237"/><path d="M79.053,6.741H20.948c-7.833,0-14.207,6.374-14.207,14.207v58.104c0,7.833,6.374,14.207,14.207,14.207h58.105  c7.833,0,14.207-6.374,14.207-14.207V20.948C93.26,13.115,86.886,6.741,79.053,6.741z M76.665,15.688  c2.313,0,4.191,1.877,4.191,4.191c0,2.315-1.878,4.192-4.191,4.192c-2.315,0-4.192-1.877-4.192-4.192  C72.473,17.564,74.35,15.688,76.665,15.688z M50,31.021c10.466,0,18.979,8.515,18.979,18.979S60.466,68.979,50,68.979  c-10.465,0-18.979-8.515-18.979-18.979S39.535,31.021,50,31.021z M86.273,79.052c0,3.981-3.239,7.221-7.221,7.221H20.948  c-3.981,0-7.221-3.239-7.221-7.221V36.646h14.018c-2.353,3.905-3.711,8.473-3.711,13.354c0,14.318,11.648,25.964,25.966,25.964  c14.317,0,25.966-11.646,25.966-25.964c0-4.883-1.364-9.45-3.72-13.354h14.027V79.052z"/>

          <Text type="name" style={{ color: 'black' }}>{this.props.data.name}</Text>
          <div>
            <Text type="age" style={{ color: 'black' }}>{age}</Text>
            <Text type="lastActive">{parsePingTime(this.props.data.ping_time)}</Text>
          </div>
          <Text type="school">{schools && schools.name}</Text>
          <Text type="jobs">{(jobs && jobs.title) && jobs.title.name}{(jobs && jobs.title) && jobs.company ? ' @ ' : null}{jobs && jobs.company && <a href={jobs.company.id} target="_blank">{jobs.company.name}</a>}</Text>
          <Text type="bio">{this.props.data.bio}</Text>
          {this.props.data.common_connections && this.props.data.common_connections.length > 0 ?
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
          {this.props.data.common_interests && this.props.data.common_interests.length > 0 ?
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
