import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  EDITING_BIO,
  REORDER_PHOTOS,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
  SELECTING_LOCATION,
  SET_GENDER_FILTER,
  SET_GENDER,
} from './constants';

import {
  selectMarkerLocation,
  selectIsSettingLocation,
} from './selectors';

import { selectAuthToken } from 'containers/Auth/selectors';
import {
  newNotification,
  newNotificationAdded
} from 'containers/Notification/actions';

import { postRequest } from 'utils/request';

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
    const { payload } = yield take([SET_AGE_FILTER, SET_DISTANCE_FILTER, SET_GENDER_FILTER, SET_GENDER]);
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

function* locationUpdateWatcherFunction() {
  while (yield take(SELECTING_LOCATION)) {
    const currentLocationData = yield select(selectMarkerLocation());
    const wasMapOpen = yield select(selectIsSettingLocation());
    if (currentLocationData.lat && currentLocationData.lng && !wasMapOpen) {
      yield fork(locationUpdateAction, currentLocationData);
    }
  }
}

export function* mainDashboardSaga() {
  const bioWatcher = yield fork(getBioUpdatesWatcher);
  const photoOrderWatcher = yield fork(getPhotoUpdateOrderWatcher);
  const profileUpdateWatcher = yield fork(profileUpdateWatcherFunction);
  const locationUpdateWatcher = yield fork(locationUpdateWatcherFunction);

  yield take(LOCATION_CHANGE);
  yield cancel(bioWatcher);
  yield cancel(photoOrderWatcher);
  yield cancel(profileUpdateWatcher);
  yield cancel(locationUpdateWatcher);
}
// All sagas to be loaded
export default [
  mainDashboardSaga,
];
