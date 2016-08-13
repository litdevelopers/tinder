import { delay } from 'redux-saga';
import { take, call, put, actionChannel, race, select } from 'redux-saga/effects';
import { selectQueuedError } from './selectors';

import { pushError, handledError } from './actions';
import {
  GLOBAL_ERROR_RECEIVED,
  GLOBAL_ERROR_ADDED,
  ERROR_MANUAL_REMOVE,
} from './constants';

export function* notificationHandler(action) {
  const error = yield select(selectQueuedError());
  yield put(pushError(error));
  yield race({
    userRemove: take(ERROR_MANUAL_REMOVE),
    cancel: call(delay, 4000),
  });
  yield put(handledError());
}

export function* notificationSaga() {
  const notificationChannel = yield actionChannel(GLOBAL_ERROR_ADDED);

  while (true) {  
    const action = yield take(notificationChannel);
    yield notificationHandler(action);
  }
}

export default [
  notificationSaga,
];
