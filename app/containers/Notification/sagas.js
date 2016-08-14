import { delay } from 'redux-saga';
import { take, call, put, actionChannel, select, race } from 'redux-saga/effects';
import { selectQueuedError } from './selectors';
import { LOCATION_CHANGE } from 'react-router-redux';


import { pushError, handledError } from './actions';
import {
  GLOBAL_ERROR_ADDED,
  ERROR_MANUAL_REMOVE,
} from './constants';

export function* notificationHandler() {
  const error = yield select(selectQueuedError());
  yield put(pushError(error));
  yield race({
    cancel: take(ERROR_MANUAL_REMOVE),
    timeOut: call(delay, 4000),
  });
  yield put(handledError());
}

export function* notificationSaga() {
  const notificationChannel = yield actionChannel(GLOBAL_ERROR_ADDED);

  while (true) {
    yield take(notificationChannel);
    yield call(notificationHandler);
    yield take(LOCATION_CHANGE);
    yield notificationChannel.close();
  }
}

export default [
  notificationSaga,
];
