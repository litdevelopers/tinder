import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Motion, spring } from 'react-motion';
import Rheostat from 'rheostat';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

import { editingBio, reorderPhotos, selectingLocation, setAgeFilter, setDistanceFilter, setGenderFilter, selectLocation, setGender, setDiscover, logOut, clearLocalData } from './actions';
import { fetchData } from 'containers/Dashboard/actions';

import { selectUserObject, selectActionsHistory } from 'containers/Dashboard/selectors';
import { selectIsSettingLocation, selectMarkerLocation } from './selectors';
import { superLikePerson, likePerson, passPerson } from 'containers/Recommendations/actions';


import { getFacebookUrl } from 'utils/facebook';
import { getAge } from 'utils/operations';

import Text from 'components/Text';
import Button from 'components/Button';
import MapView from 'components/MapView';
import Icon from 'components/Icon';
import HistoryEntry from 'components/HistoryEntry';
import styles from './styles.css';

const VALUE_TO_START_RENDERING = 3.8;

const PhotoList = SortableContainer(({ items }) => { // eslint-disable-line
  const photoList = [];
  for (let iter = 0; iter < 6; iter++) {
    photoList.push(<PhotoItem key={`photo-${iter}`} index={iter} photo={items[iter]} disabled={!items[iter]} />);
  }
  return (
    <div className={styles.mainDashboardSettingsPictureRow}>
      {photoList}
    </div>
  );
});

const PhotoItem = SortableElement(({ photo, uploadBlock }) => <div className={styles.photoItem} style={{ backgroundImage: `url(${photo ? photo.processedFiles[0].url : ''})` }}>{uploadBlock ? <Text type="dashboardSettingsHeaderPhoto">Upload a photo<input name="photoUpload" id="photoUpload" className={styles.dashboardFile} type="file" /><label htmlFor="photoUpload"><Text type="dashboardSettingsSubheader" style={{ fontSize: 12, cursor: 'pointer' }}>to your profile</Text></label></Text> : null}</div>); // eslint-disable-line


export class MainDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.state = {
      updated: false,
    };
    this.onSetAgeFilter = this.onSetAgeFilter.bind(this);
    this.onSetDiscover = this.onSetDiscover.bind(this);
    this.onSetDistanceFilter = this.onSetDistanceFilter.bind(this);
    this.onSetGender = this.onSetGender.bind(this);
    this.onSetGenderFilter = this.onSetGenderFilter.bind(this);
    this.onChangeNotificationSettings = this.onChangeNotificationSettings.bind(this);
  }

  componentWillMount() {
    this.props.fetchInitialData();
  }

  onSetAgeFilter(newValue) {
    this.props.setAgeFilter(newValue.values);
  }

  onSetDistanceFilter(newValues) {
    this.props.setDistanceFilter(newValues.values);
  }

  onSetGender(event) {
    this.props.setGender(event.target.value);
  }

  onSetGenderFilter(event) {
    this.props.setGenderFilter(event.target.value);
  }

  onSetDiscover(event) {
    this.props.setDiscover(event.target.value);
  }

  onChangeNotificationSettings(event) {
    localStorage.setItem(event.target.id, event.target.value);
    this.setState({
      updated: !this.state.updated,
    });
  }

  renderPhotos(photos) {
    return <PhotoList axis="x" items={photos} onSortEnd={({ oldIndex, newIndex }) => { this.props.reorderPhotos(arrayMove(photos, oldIndex, newIndex)); }} />;
  }

  renderHistory() {
    if (!this.props.actionsHistory) {
      return undefined;
    }
    return this.props.actionsHistory.map((each) =>
      <HistoryEntry
        key={each.id}
        data={each}
        onClickButton={this.props.onClickButton}
      />);
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
                    { flex > VALUE_TO_START_RENDERING ?
                      <div className={styles.mainDashboardContentContainerTeaser}>
                        <Text type="bio">{getAge(userObject.birth_date)}</Text>
                        <Text type="bio">{userObject.gender === 0 ? 'Male' : 'Female'}</Text>
                        <Text type="bio">{schools[0] && schools[0].name}</Text>
                      </div> : null}
                    { flex > VALUE_TO_START_RENDERING ?
                      <div className={styles.bioContainer} style={{}}>
                        <label htmlFor="bioInput" className={styles.bioInputLabel}>About {userObject.name} <Text type="bioInputTextCount">{500 - bio.length}</Text></label>
                        <textarea value={bio} className={styles.bioInput} id="bioInput" onChange={this.props.editingBio} spellCheck="false" />
                        <Text type="bio" style={{ padding: 10 }}>Your Interests</Text>
                        <div className={styles.interestsContainer}>
                          <div className={styles.interestsContainerWrapper}>
                            {interests.map((each) =>
                              (
                              <a
                                key={each.id}
                                href={getFacebookUrl(each.id)}
                                target="_blank"
                                className={styles.commonInterestsLink}
                              >
                                <Text type="commonInterest">{each.name}</Text>
                              </a>
                              )
                            )}
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
              <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Your Photos<Text type="dashboardSettingsSubheader" style={{ fontSize: 12 }}>Rearrange your images</Text></Text>
              {this.renderPhotos(photos)}
              <div className={styles.mainDashboardScrollable}>
                <div className={styles.mainDashboardScrollableColumn}>
                  <div className={styles.mainDashboardScrollableColumnContainer}>
                    <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Age, Gender and distance options<Text type="dashboardSettingsSubheader" style={{ fontSize: 12 }}>Adjust your settings here</Text></Text>
                    <div className={styles.mainDashboardSlider}>
                      <Rheostat
                        min={18}
                        snap
                        onValuesUpdated={this.onSetAgeFilter}
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
                        onValuesUpdated={this.onSetDistanceFilter}
                        values={[Number(userObject.distance_filter)]}
                        className={styles.styledSlider}
                      />
                      <div className={styles.sliderText}>
                        <Text type="bio" style={{ flex: 1 }}>1 km</Text>
                        <Text type="matchRecentMessage" style={{ flex: 1, textAlign: 'center' }}>Distance Filter</Text>
                        <Text type="bio" style={{ flex: 1, textAlign: 'right' }}>{(userObject.distance_filter * 1.6).toFixed(0)} km</Text>
                      </div>
                    </div>
                    <div className={styles.mainDashboardTogglesContainer}>
                      <div className={styles.mainDashboardTogglesSection}>
                        <Text type="matchRecentMessage">I am a...</Text>
                        <select
                          className={styles.mainDashboardDropdown}
                          value={userObject.gender}
                          onChange={this.onSetGender}
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
                          onChange={this.onSetGenderFilter}
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
                          onChange={this.onSetDiscover}
                        >
                          <option value={true}>True</option>
                          <option value={false}>False</option>
                        </select>
                      </div>
                    </div>
                    <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Notification Settings<Text type="dashboardSettingsSubheader" style={{ fontSize: 12 }}>Adjust when and what you're notified about</Text></Text>
                    <div className={styles.mainDashboardSwitchContainer}>
                      <div className={styles.mainDashboardSwitchBox}>
                        <Icon type="notificationMatch" />
                        <Text type="switchText">New match</Text>
                        <div className={styles.mainDashboardSwitchInput}>
                          <select
                            className={styles.mainDashboardSwitch}
                            value={localStorage.getItem('matchesNotification') || undefined}
                            id="matchesNotification"
                            onChange={this.onChangeNotificationSettings}
                          >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.mainDashboardSwitchBox}>
                        <Icon type="notificationMessage" />
                        <Text type="switchText">New message</Text>
                        <div className={styles.mainDashboardSwitchInput}>
                          <select
                            className={styles.mainDashboardSwitch}
                            value={localStorage.getItem('messageNotification') || undefined}
                            id="messageNotification"
                            onChange={this.onChangeNotificationSettings}
                          >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>
                      <div className={styles.mainDashboardSwitchBox}>
                        <Icon type="notificationLike" />
                        <Text type="switchText">New message like</Text>
                        <div className={styles.mainDashboardSwitchInput}>
                          <select
                            className={styles.mainDashboardSwitch}
                            value={localStorage.getItem('messagesLikeNotification') || undefined}
                            id="messagesLikeNotification"
                            onChange={this.onChangeNotificationSettings}
                          >
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Account settings<Text type="dashboardSettingsSubheader" style={{ fontSize: 12 }}>Log out or clear stored data</Text></Text>
                    <div className={styles.mainDashboardTogglesContainer} style={{ marginTop: 0 }}>
                      <Button type="accountSettings" onClick={this.props.logOut}>Log out</Button>
                      <Button type="accountSettings" onClick={this.props.clearLocalData}>Clear local data</Button>
                    </div>
                  </div>
                </div>
                <div className={styles.mainDashboardScrollableColumn}>
                  <Text type="dashboardSettingsHeader" style={{ fontWeight: 300 }}>Your actions<Text type="dashboardSettingsSubheader" style={{ fontSize: 12 }}>Swipe and match history activity in Lit.</Text></Text>
                  <div className={styles.mainDashboardScrollableColumnContainer} style={{ borderTop: '1px solid #eee' }}>
                    <ul className={styles.actionsHistoryContainer}>
                      {this.renderHistory()}
                    </ul>
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
  clearLocalData: PropTypes.func,
  logOut: PropTypes.func,
  userObject: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  markerLocation: PropTypes.object,
  isSelectingLocation: PropTypes.bool,
  actionsHistory: PropTypes.array,
  onClickButton: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  userObject: selectUserObject(),
  markerLocation: selectMarkerLocation(),
  isSelectingLocation: selectIsSettingLocation(),
  actionsHistory: selectActionsHistory(),
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
    logOut: () => dispatch(logOut()),
    clearLocalData: () => dispatch(clearLocalData()),
    onClickButton: (id, hash, details, type) => {
      if (type === 'like') dispatch(likePerson(id, hash, details));
      if (type === 'pass') dispatch(passPerson(id, hash, details));
      if (type === 'superlike') dispatch(superLikePerson(id, hash, details));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainDashboard);

