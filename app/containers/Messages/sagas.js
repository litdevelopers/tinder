import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import { postRequest } from 'utils/request';
import {
  SEND_MESSAGE,
} from './constants';

import {
  sendMessageSuccess,
  sendMessageError,
} from './actions';

import {
  selectAuthToken,
} from 'containers/Auth/selectors';

// Individual exports for testing
export function* sendMessageData(payload) {
  const userToken = yield select(selectAuthToken());
  const { id, message } = payload;
  const postURL = `${AUTH_URL}/tinder/message/${id}`;

  try {
    const result = yield call(postRequest, postURL, { userToken, message });
    if (result.status === 200) {
      yield put(sendMessageSuccess());
    }
  } catch (error) {
    yield put(sendMessageError(error));
  }
}

function* sendMessageWatcher() {
  let currentMessage;
  while (yield take(SEND_MESSAGE)) {
    const payload = yield take(SEND_MESSAGE);

    if (currentMessage) {
      yield cancel(currentMessage);
    }

    currentMessage = yield fork(sendMessageData, payload);
  }
}

export function* messageSaga() {
  const messageWatcher = yield fork(sendMessageWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(messageWatcher);
}
// All sagas to be loaded
export default [
  messageSaga,
];
