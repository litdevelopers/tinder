import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Motion, spring } from 'react-motion';
import { SortablePane, Pane } from 'react-sortable-pane';


import { fetchTinderData } from 'containers/Dashboard/actions';
import { selectUserObject } from 'containers/Dashboard/selectors';
import { getFacebookUrl } from 'utils/facebook';
import { getAge } from 'utils/operations';
import { editingBio, reorderPhotos } from './actions';

import Text from 'components/Text';
import styles from './styles.css';

// const photoItem = SortableElement((imageUrl) => <div className={styles.photoItem} style={{ backgroundImage: `url(${imageUrl})` }}></div>);
// const photoList = SortableContainer((photos) => photos.map((each, index) => <photoItem key={`photo-${index}`} index={index} value={each.processedFiles[0].iter} />));


export class MainDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // check if token and userid exists or not
    this.props.fetchInitialData();
  }


  renderPhotos(photos) {
    return (
      <SortablePane
        className={styles.mainDashboardSettingsPictureRow}
        onOrderChange={(oldOrder, newOrder) => { this.props.reorderPhotos(newOrder); }}
        zIndex={1}
      >
        {photos.map((eachPhoto) => {
          return (
            <Pane
              id={eachPhoto.id}
              key={eachPhoto.id}
              height={200}
              width={200}
              style={{ backgroundImage: `url(${eachPhoto.processedFiles[0].url})` }}
              className={styles.photoItem}
              isResizable={{ x: false, y: false, xy: false }}
            />
          );
        })}
      </SortablePane>

     );
  }


  render() {
    const { userObject } = this.props;
    if (userObject) {
      const { schools, bio, interests, photos } = userObject;

      return (
        <div className={styles.mainDashboard}>
          <div className={styles.mainDashboardProfile}>
            <div className={styles.mainDashboardHeader}>
            </div>
            <Motion
              defaultStyle={{
                flex: 0,
                width: 50,
                minHeight: 50,
              }}
              style={{
                flex: spring(4, [300, 26]),
                width: 150,
                minHeight: 150,
              }}
            >
              {({ flex, width, minHeight }) =>
                <div className={styles.mainDashboardContent} style={{ flex }}>
                  <div className={styles.mainDashboardProfilePicture} style={{ backgroundImage: `url(${userObject.photos[0].url}`, width, minHeight }} />
                  <div className={styles.mainDashboardContentContainer}>
                    <div className={styles.profileNameContainer}>
                      <Text type="profileName">{userObject.full_name}</Text>
                    </div>
                    <div className={styles.mainDashboardContentContainerTeaser}>
                      <Text type="bio">{getAge(userObject.birth_date)}</Text>
                      <Text type="bio">{userObject.gender === 0 ? 'Male' : 'Female'}</Text>
                      <Text type="bio">{schools[0] && schools[0].name}</Text>
                    </div>
                    <div className={styles.bioContainer}>
                      <label htmlFor="bioInput" className={styles.bioInputLabel}>About {userObject.name} <Text type="bioInputTextCount">{500 - bio.length}</Text></label>
                      <textarea value={bio} className={styles.bioInput} id="bioInput" onChange={this.props.editingBio} spellCheck="false" />
                      <Text type="bio" style={{ padding: 10 }}>Your Interests</Text>
                      <div className={styles.interestsContainer}>
                        <div className={styles.interestsContainerWrapper}>
                          {interests.map((each) => {
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
                      </div>
                    </div>
                  </div>
                </div>
              }
            </Motion>
          </div>
          <div className={styles.mainDashboardSettings}>
              {photos && this.renderPhotos(photos)}
            <div className={styles.mainDashboardSettingsMain}>

            </div>
          </div>
        </div>);
    }
    return null;
  }
}

MainDashboard.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  userObject: PropTypes.object,
  editingBio: PropTypes.func,
  reorderPhotos: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userObject: selectUserObject(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchInitialData: () => dispatch(fetchTinderData()),
    editingBio: (e) => dispatch(editingBio(e.target.value)),
    reorderPhotos: (photoOrder) => dispatch(reorderPhotos(photoOrder.map((each) => each.id))),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainDashboard);
