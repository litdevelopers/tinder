import { delay } from 'redux-saga';
import { take, call, put, actionChannel, cancel, select, fork } from 'redux-saga/effects';
import { selectQueuedError } from './selectors';
import { LOCATION_CHANGE } from 'react-router-redux';


import { pushError, handledError } from './actions';
import {
  GLOBAL_ERROR_RECEIVED,
  GLOBAL_ERROR_ADDED,
  ERROR_MANUAL_REMOVE,
} from './constants';

export function* notificationHandler() {
  const error = yield select(selectQueuedError());
  yield put(pushError(error));
  yield call(delay, 4000);
  yield put(handledError());
}

export function* notificationWatcher() {
  const notificationChannel = yield actionChannel(GLOBAL_ERROR_ADDED);

  while (true) {
    yield take(notificationChannel);
    yield call(notificationHandler);
  }
}

export function* notificationSaga() {
  const watcher = yield fork(notificationWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  notificationSaga,
];
