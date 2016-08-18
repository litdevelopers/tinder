import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import { postRequest } from 'utils/request';
import { messagesSortByRecent } from 'utils/operations';

import {
  SEND_MESSAGE,
  FETCH_MATCHES_DATA,
} from './constants';
import { selectPointer } from './selectors';

import {
  sendMessageSuccess,
  sendMessageError,
  updatePointer,
  allDataFetched,
  fetchMatchDataError,
  fetchMatchDataSuccess,
} from './actions';
import { newError, newErrorAdded } from 'containers/Notification/actions';


import {
  selectAuthToken,
} from 'containers/Auth/selectors';




function* fetchHistoryData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/historynew`;
  const pointer = yield select(selectPointer());
  try {
    const data = yield call(postRequest, postURL, { authToken, pointer });
    if (data.status === 200) {
      const { matches, final, ...rest } = data.data;
      // yield put(fetchDataSuccess('history', rest));
      yield put(fetchMatchDataSuccess(matches.slice().sort((a, b) => messagesSortByRecent(a, b))));
      if (final) {
        yield put(allDataFetched());
      } else {
        yield put(updatePointer());
      }
    }
  } catch (error) {
    yield put(fetchMatchDataError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}



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
    yield put(newError(error));
    yield put(newErrorAdded());
  }
}

function* sendMessageWatcher() {
  const messageWatch = yield actionChannel(SEND_MESSAGE);

  while (true) {
    const { payload } = yield take(messageWatch);
    yield sendMessageData(payload);
  }
}

function* dataWatcher() {
  while (yield take(FETCH_MATCHES_DATA)) {
    yield call(fetchHistoryData);
  }
}

export function* messageSaga() {
  const messageWatcher = yield fork(sendMessageWatcher);
  const dataFetchWatcher = yield fork(dataWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(messageWatcher);
  yield cancel(dataFetchWatcher);
}
// All sagas to be loaded
export default [
  messageSaga,
];
