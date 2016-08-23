import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Motion, spring } from 'react-motion';
import Rheostat from 'rheostat';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import { editingBio, reorderPhotos, selectingLocation, setAgeFilter, setDistanceFilter, setGenderFilter, selectLocation, setGender, setDiscover } from './actions';
import { fetchData } from 'containers/Dashboard/actions';

import { selectUserObject } from 'containers/Dashboard/selectors';
import { selectIsSettingLocation, selectMarkerLocation } from './selectors';

import { getFacebookUrl } from 'utils/facebook';
import { getAge } from 'utils/operations';

import Text from 'components/Text';
import MapView from 'components/MapView';
import styles from './styles.css';

const PhotoList = SortableContainer(({ items }) => { // eslint-disable-line
  const photoList = [];
  for (let iter = 0; iter < 6; iter++) {
    photoList.push(<PhotoItem hideSortableGhost key={`photo-${iter}`} index={iter} photo={items[iter]} disabled={!items[iter]} />);
  }
  return (
    <div className={styles.mainDashboardSettingsPictureRow}>
      {photoList}
    </div>
  );
});

const PhotoItem = SortableElement(({ photo }) => <div className={styles.photoItem} style={{ backgroundImage: `url(${photo ? photo.processedFiles[0].url : ''})` }} />); // eslint-disable-line


export class MainDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.fetchInitialData();
  }

  renderPhotos(photos) {
    return <PhotoList axis="x" items={photos} onSortEnd={({ oldIndex, newIndex }) => { this.props.reorderPhotos(arrayMove(photos, oldIndex, newIndex)); }} />;
  }

  render() {
    const { userObject } = this.props;
    if (userObject) {
      const { schools, bio, interests, photos } = userObject;
      return (
        <div className={styles.mainDashboard}>
          <div className={styles.mainDashboardProfile}>
            <div className={styles.mainDashboardHeader}>
              <MapView
                onClick={this.props.selectLocation}
                open={this.props.isSelectingLocation}
                markerLocation={this.props.markerLocation}
                onSelectMarker={this.props.selectMarkerLocation}
              />
            </div>
            <Motion
              defaultStyle={{
                flex: this.props.isSelectingLocation ? 0.1 : 0,
                width: this.props.isSelectingLocation ? 150 : 50,
                minHeight: this.props.isSelectingLocation ? 150 : 50,
              }}
              style={{
                flex: this.props.isSelectingLocation ? 0 : spring(4, [0, 0]),
                width: this.props.isSelectingLocation ? 50 : 150,
                minHeight: this.props.isSelectingLocation ? 50 : 150,
              }}
            >
              {({ flex, width, minHeight }) =>
                <div className={styles.mainDashboardContent} style={{ flex }}>
                  <div className={styles.mainDashboardProfilePicture} style={{ backgroundImage: `url(${userObject.photos[0].url}`, width, minHeight }} />
                  <div className={styles.mainDashboardContentContainer}>
                    <div className={styles.profileNameContainer}>
                      <Text type="profileName">{userObject.full_name}</Text>
                    </div>
                    { flex > 3.8 ?
                      <div className={styles.mainDashboardContentContainerTeaser}>
                        <Text type="bio">{getAge(userObject.birth_date)}</Text>
                        <Text type="bio">{userObject.gender === 0 ? 'Male' : 'Female'}</Text>
                        <Text type="bio">{schools[0] && schools[0].name}</Text>
                      </div> : null}
                    { flex > 3.8 ?
                      <div className={styles.bioContainer} style={{}}>
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
                      </div> : null}
                  </div>
                </div>
              }
            </Motion>
          </div>
          <div className={styles.mainDashboardSettings}>
            <div className={styles.mainDashboardSettingsMain}>
              <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Your Photos<Text type="matchRecentMessage" style={{ fontSize: 12 }}>Rearrange your images</Text></Text>
              {this.renderPhotos(photos)}
              <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Age, Gender and distance options<Text type="matchRecentMessage" style={{ fontSize: 12 }}>Adjust your settings here</Text></Text>
              <div className={styles.mainDashboardSliders}>
                <div className={styles.mainDashboardSlider}>
                  <Rheostat
                    min={18}
                    snap
                    onValuesUpdated={(newValues) => this.props.setAgeFilter(newValues.values)}
                    max={55}
                    values={[userObject.age_filter_min, userObject.age_filter_max > 55 ? 55 : userObject.age_filter_max]}
                    className={styles.styledSlider}
                  />
                  <div className={styles.sliderText}>
                    <Text type="bio" style={{ flex: 1 }}>{userObject.age_filter_min}</Text>
                    <Text type="matchRecentMessage" style={{ flex: 1, textAlign: 'center' }}>Age Preference</Text>
                    <Text type="bio" style={{ flex: 1, textAlign: 'right' }}>{userObject.age_filter_max > 55 ? '55+' : userObject.age_filter_max}</Text>
                  </div>
                </div>
                <div className={styles.mainDashboardSlider}>
                  <Rheostat
                    min={3.2}
                    snap
                    max={160}
                    onValuesUpdated={(newValues) => {
                      this.props.setDistanceFilter(newValues.values);
                    }}
                    values={[Number(userObject.distance_filter)]}
                    className={styles.styledSlider}
                  />
                  <div className={styles.sliderText}>
                    <Text type="bio" style={{ flex: 1 }}>1 km</Text>
                    <Text type="matchRecentMessage" style={{ flex: 1, textAlign: 'center' }}>Distance Filter</Text>
                    <Text type="bio" style={{ flex: 1, textAlign: 'right' }}>{(userObject.distance_filter * 1.6).toFixed(0)} km</Text>
                  </div>
                </div>
              </div>
              <div className={styles.mainDashboardToggles}>
                <div className={styles.mainDashboardTogglesContainer}>
                  <div className={styles.mainDashboardTogglesSection}>
                    <Text type="matchRecentMessage">I am a...</Text>
                    <select
                      className={styles.mainDashboardDropdown}
                      value={userObject.gender}
                      onChange={(e) => this.props.setGender(e.target.value)}
                    >
                      <option value={0}>Male</option>
                      <option value={1}>Female</option>
                    </select>
                  </div>
                  <div className={styles.mainDashboardTogglesSection}>
                    <Text type="matchRecentMessage">Show me...</Text>
                    <select
                      className={styles.mainDashboardDropdown}
                      value={userObject.gender_filter}
                      onChange={(e) => this.props.setGenderFilter(e.target.value)}
                    >
                      <option value={0}>Males</option>
                      <option value={1}>Females</option>
                      <option value={-1}>Both</option>
                    </select>
                  </div>
                  <div className={styles.mainDashboardTogglesSection}>
                    <Text type="matchRecentMessage">Discoverable</Text>
                    <select
                      className={styles.mainDashboardDropdown}
                      value={userObject.discoverable}
                      onChange={(e) => this.props.setDiscover(e.target.value)}
                    >
                      <option value={true}>True</option>
                      <option value={false}>False</option>
                    </select>
                  </div>
                  <div className={styles.mainDashboardTogglesSection}>

                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>);
    }
    return null;
  }
}

MainDashboard.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  selectMarkerLocation: PropTypes.func,
  editingBio: PropTypes.func,
  reorderPhotos: PropTypes.func,
  selectLocation: PropTypes.func,
  setAgeFilter: PropTypes.func,
  setDistanceFilter: PropTypes.func,
  setGenderFilter: PropTypes.func,
  setDiscover: PropTypes.func,
  setGender: PropTypes.func,
  userObject: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  markerLocation: PropTypes.object,
  isSelectingLocation: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  userObject: selectUserObject(),
  markerLocation: selectMarkerLocation(),
  isSelectingLocation: selectIsSettingLocation(),
});

function mapDispatchToProps(dispatch) {
  return {
    setGender: (newValue) => dispatch(setGender(Number(newValue))),
    setGenderFilter: (newValue) => dispatch(setGenderFilter(Number(newValue))),
    selectLocation: () => dispatch(selectingLocation()),
    setDistanceFilter: (newData) => dispatch(setDistanceFilter(newData)),
    selectMarkerLocation: (lat, lng) => dispatch(selectLocation(lat, lng)),
    setAgeFilter: (newData) => dispatch(setAgeFilter(newData)),
    fetchInitialData: () => dispatch(fetchData('USER_DATA')),
    editingBio: (e) => dispatch(editingBio(e.target.value)),
    reorderPhotos: (photoOrder) => dispatch(reorderPhotos(photoOrder)),
    setDiscover: (newValue) => dispatch(setDiscover(newValue)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainDashboard);

