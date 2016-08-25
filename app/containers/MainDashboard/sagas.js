import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  EDITING_BIO,
  REORDER_PHOTOS,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
  SELECTING_LOCATION,
  SET_GENDER_FILTER,
  SET_GENDER,
  SET_DISCOVER,
  CLEAR_LOCAL_DATA,
  LOG_OUT,
} from './constants';

import {
  selectMarkerLocation,
  selectIsSettingLocation,
} from './selectors';

import { selectAuthToken } from 'containers/Auth/selectors';
import { selectUserID } from 'containers/Dashboard/selectors';

import {
  newNotification,
  newNotificationAdded,
} from 'containers/Notification/actions';

import { emptyReducer } from 'containers/Auth/actions';

import { postRequest } from 'utils/request';
import {
  removeToken,
  removeChunkWithArray,
  getToken,
} from 'utils/operations';

function* updateBioAction(newBio) {
  yield call(delay, 1000);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/bio`;

  try {
    yield call(postRequest, postURL, { authToken, bio: newBio });
  } catch (error) {
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* updatePhotoOrderAction(newOrder) {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/photoOrder`;

  try {
    yield call(postRequest, postURL, { authToken, order: newOrder.map((each) => each.id) });
  } catch (error) {
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* profileUpdateAction(newObject) {
  yield call(delay, 100);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/profile`;

  try {
    yield call(postRequest, postURL, { authToken, profile: newObject });
  } catch (error) {
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* genderUpdateAction(newObject) {
  yield call(delay, 100);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/profile/gender`;

  try {
    yield call(postRequest, postURL, { authToken, gender: newObject });
  } catch (error) {
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}


function* locationUpdateAction(locationData) {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/location`;

  try {
    yield call(postRequest, postURL, { authToken, location: locationData });
  } catch (error) {
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

function* getBioUpdatesWatcher() {
  let currentUpdate;
  while (yield take(EDITING_BIO)) {
    const { payload } = yield take(EDITING_BIO);

    if (currentUpdate) {
      yield cancel(currentUpdate);
    }

    currentUpdate = yield fork(updateBioAction, payload);
  }
}

function* getPhotoUpdateOrderWatcher() {
  while (true) {
    const { payload } = yield take(REORDER_PHOTOS);

    yield fork(updatePhotoOrderAction, payload);
  }
}

function* profileUpdateWatcherFunction() {
  let currentUpdate;

  while (yield ([SET_AGE_FILTER, SET_DISTANCE_FILTER])) {
    const { payload } = yield take([SET_AGE_FILTER, SET_DISTANCE_FILTER, SET_GENDER_FILTER, SET_GENDER, SET_DISCOVER]);
    if (currentUpdate) {
      yield cancel(currentUpdate);
    }

    if (Object.keys(payload).indexOf('gender')) {
      currentUpdate = yield fork(genderUpdateAction, payload);
    } else {
      currentUpdate = yield fork(profileUpdateAction, payload);
    }
  }
}

function* clearLocalData() {
  const userID = yield select(selectUserID());
  const matchesList = yield getToken(`matchesList_${userID}`);
  const recommendationsList = yield getToken(`recommendationsList_${userID}`);
  try {
    if (matchesList) yield removeChunkWithArray(matchesList);
    if (recommendationsList) yield removeChunkWithArray(recommendationsList);
    yield removeToken(`matchesList_${userID}`);
    yield removeToken(`recommendationsList_${userID}`);
  } catch (error) {
    console.warn(error);
  }
}

function* locationUpdateWatcherFunction() {
  while (yield take(SELECTING_LOCATION)) {
    const currentLocationData = yield select(selectMarkerLocation());
    const wasMapOpen = yield select(selectIsSettingLocation());
    if (currentLocationData.lat && currentLocationData.lng && !wasMapOpen) {
      yield fork(locationUpdateAction, currentLocationData);
    }
  }
}

function* logOut() {
  yield removeToken('tinderToken');
  yield removeToken('fbToken');
  yield call(emptyReducer);
  window.location.replace('/');
}

function* logOutWatcher() {
  while (yield take(LOG_OUT)) {
    yield fork(logOut);
  }
}

function* clearLocalWatcher() {
  while (yield take(CLEAR_LOCAL_DATA)) {
    yield fork(clearLocalData);
  }
}

export function* mainDashboardSaga() {
  const bioWatcher = yield fork(getBioUpdatesWatcher);
  const photoOrderWatcher = yield fork(getPhotoUpdateOrderWatcher);
  const profileUpdateWatcher = yield fork(profileUpdateWatcherFunction);
  const locationUpdateWatcher = yield fork(locationUpdateWatcherFunction);
  const logOutWatch = yield fork(logOutWatcher);
  const clearLocalWatch = yield fork(clearLocalWatcher);
  const watchers = [bioWatcher, photoOrderWatcher, profileUpdateWatcher, locationUpdateWatcher, logOutWatch, clearLocalWatch];

  yield take(LOCATION_CHANGE);
  yield watchers.map((each) => cancel(each));
}
// All sagas to be loaded
export default [
  mainDashboardSaga,
];
