import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_DATA,
  FETCH_UPDATES,
  STORE_META_DATA_SUCCESS,
} from './constants';

import {
  fetchDataSuccess,
  fetchDataError,
  fetchUpdatesSuccess,
  fetchUpdatesError,
  fetchUpdatesEnd,
  storeMetadataSuccess,
} from './actions';

import { newError, newErrorAdded } from 'containers/Notification/actions';

import { selectAuthToken } from 'containers/Auth/selectors';
import { postRequest } from 'utils/request';
import { storeToken } from 'utils/operations';



function* getUserData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/user`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200) {
      yield put(fetchDataSuccess('user', data.data.user));
      yield put(fetchDataSuccess('rating', data.data.rating));
    }
  } catch (error) {
    yield put(fetchDataError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

export function* tinderBackgroundSync() {
  try {
    while (true) { // eslint-disable-line
      const authToken = yield select(selectAuthToken());
      const postURL = `${AUTH_URL}/tinder/updates`;
      yield call(delay, 5000);
      try {
        const data = yield call(postRequest, postURL, { authToken });
        yield put(fetchUpdatesSuccess(data.data));
      } catch (error) {
        yield put(fetchUpdatesError(error));
        yield put((newError(error)));
        yield put(newErrorAdded());
      }
    }
  } finally {
    yield put(fetchUpdatesEnd());
  }
}

function* storeMetadataAction() {
  yield storeToken('last_activity_date', new Date().toISOString());
  yield put(storeMetadataSuccess());
}

function* getDataFetchWatcher() {
  while (true) {
    const { payload } = yield take(FETCH_DATA);
    switch (payload) {
      case 'USER_DATA':
        yield fork(getUserData);
        break;
      default:
        return;
    }
  }
}

function* getUpdatesWatcher() {
  while (yield take(FETCH_UPDATES)) {
    // starts the task in the background
    yield fork(tinderBackgroundSync);
  }
}

function* metaDataWatcher() {
  while (yield take(LOCATION_CHANGE)) {
    yield fork(storeMetadataAction);
  }
}

// Individual exports for testing
export function* dashboardSaga() {
  const dataFetchWatcher = yield fork(getDataFetchWatcher);
  const metaDataWatch = yield fork(metaDataWatcher);
  yield fork(getUpdatesWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(dataFetchWatcher);
  yield take(STORE_META_DATA_SUCCESS);
  yield cancel(metaDataWatch);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

