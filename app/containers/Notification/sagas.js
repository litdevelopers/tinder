import { delay } from 'redux-saga';
import { take, call, put, actionChannel, fork, race, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';


import { pushNotification, handledNotification } from './actions';
import {
  GLOBAL_NOTIFICATION_RECEIVED,
  NOTIFICATION_MANUAL_REMOVE,
} from './constants';

function* notificationHandler(errorData) {
  yield put(pushNotification(errorData));
  yield race({
    cancel: take(NOTIFICATION_MANUAL_REMOVE),
    timeOut: call(delay, 4000),
  });
  yield put(handledNotification());
}

function* notificationWatcher() {
  const notificationsChannel = yield actionChannel(GLOBAL_NOTIFICATION_RECEIVED);
  while (true) {
    const { payload } = yield take(notificationsChannel);
    yield call(notificationHandler, payload);
  }
}

export function* notificationSaga() {
  const notifications = yield fork(notificationWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(notifications);
}

export default [
  notificationSaga,
];
