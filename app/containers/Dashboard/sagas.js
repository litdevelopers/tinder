import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';


import {
  FETCH_TINDER_DATA,
} from './constants';

import {
  fetchTinderData,
  fetchTinderDataSuccess,
  fetchTinderDataError,
} from './actions';

import {
  selectToken,
  selectId,
} from 'containers/Auth/selectors';

import { postRequest } from 'utils/request';

export function* getTinderData() {
  const token = yield select(selectToken());
  const id = yield select(selectId());
  const postURL = `${AUTH_URL}/tinder/data`;

  const data = yield call(postRequest, postURL, { token, id });
  console.log(data);
}

export function* dashboardWatcher() {
  while(yield take(FETCH_TINDER_DATA)) {
    yield call(getTinderData);
  }
}

// Individual exports for testing
export function* dashboardSaga() {
  const watcher = yield fork(dashboardWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];
