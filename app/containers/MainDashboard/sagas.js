import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  EDITING_BIO,
  REORDER_PHOTOS,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
} from './constants';

import { selectAuthToken } from 'containers/Auth/selectors';
import { newError, newErrorAdded } from 'containers/Notification/actions';

import { postRequest } from 'utils/request';

function* updateBioAction(newBio) {
  yield call(delay, 1000);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/bio`;

  try {
    yield call(postRequest, postURL, { authToken, bio: newBio });
  } catch (error) {
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

function* updatePhotoOrderAction(newOrder) {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/photoOrder`;

  try {
    yield call(postRequest, postURL, { authToken, order: newOrder.filter((each) => each.indexOf('photo') === -1) });
  } catch (error) {
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

function* profileUpdateAction(newObject) {
  yield call(delay, 100);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/profile`;

  try {
    yield call(postRequest, postURL, { authToken, profile: newObject });
  } catch (error) {
    yield put((newError(error)));
    yield put(newErrorAdded());
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
  let currentUpdate;
  while (yield take(REORDER_PHOTOS)) {
    const { payload } = yield take(REORDER_PHOTOS);

    if (currentUpdate) {
      yield cancel(currentUpdate);
    }

    currentUpdate = yield fork(updatePhotoOrderAction, payload);
  }
}

function* profileUpdateWatcherFunction() {
  let currentUpdate;

  while (yield ([SET_AGE_FILTER, SET_DISTANCE_FILTER])) {
    const { payload } = yield take([SET_AGE_FILTER, SET_DISTANCE_FILTER]);

    if (currentUpdate) {
      yield cancel(currentUpdate);
    }

    currentUpdate = yield fork(profileUpdateAction, payload);
  }
}

export function* mainDashboardSaga() {
  const bioWatcher = yield fork(getBioUpdatesWatcher);
  const photoOrderWatcher = yield fork(getPhotoUpdateOrderWatcher);
  const profileUpdateWatcher = yield fork(profileUpdateWatcherFunction);


  yield take(LOCATION_CHANGE);
  yield cancel(bioWatcher);
  yield cancel(photoOrderWatcher);
  yield cancel(profileUpdateWatcher);
}
// All sagas to be loaded
export default [
  mainDashboardSaga,
];
