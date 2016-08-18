import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import { postRequest } from 'utils/request';
import { messagesSortByRecent, storeChunkWithToken, getStoreLength, fetchChunkData, storeToken, getToken } from 'utils/operations';

import {
  SEND_MESSAGE,
  FETCH_MATCHES_DATA,
  FETCH_MATCHES_LOCALLY,
  DUMP_ALL_SUCCESS,
  DUMP_ALL_INIT,
} from './constants';
import { selectPointer, selectMatches, selectIsAllFetched } from './selectors';

import {
  sendMessageSuccess,
  sendMessageError,
  updatePointer,
  allDataFetched,
  fetchMatchDataError,
  fetchMatchDataSuccess,
  dumpAll,
  dumpAllSuccess,
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
      const { matches, final, ...rest } = data.data; // eslint-disable-line
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

// EXPERIMENTAL
export function* dumpDataAction() {
  const data = yield select(selectMatches());
  yield put(dumpAll());
  const idList = yield storeChunkWithToken(data);
  yield storeToken('matchesList', idList);
  yield put(dumpAllSuccess());
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

export function* loadLocalData() {
  const storeLength = yield getStoreLength();
  const freshBatch = yield select(selectIsAllFetched());
  if (storeLength > 2 && freshBatch) {
    console.log('Previous data stored, loading');
    const matchesList = yield getToken('matchesList');
    const matches = yield fetchChunkData(matchesList);
    yield put(fetchMatchDataSuccess(matches));
  } else {
    console.warn('No Previous data stored.');
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

function* dumpDataWatcher() {
  while (yield take(DUMP_ALL_INIT)) {
    yield call(dumpDataAction);
  }
}

function* dataLoadLocalWatcher() {
  while (yield take(FETCH_MATCHES_LOCALLY)) {
    yield call(loadLocalData);
  }
}

export function* messageSaga() {
  const messageWatcher = yield fork(sendMessageWatcher);
  const dataFetchWatcher = yield fork(dataWatcher);
  const dataDumpWatch = yield fork(dumpDataWatcher);
  const dataLoadLocalWatch = yield fork(dataLoadLocalWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(messageWatcher);
  yield cancel(dataFetchWatcher);
  yield cancel(dataLoadLocalWatch);
  yield take(DUMP_ALL_SUCCESS);
  yield cancel(dataDumpWatch);
}
// All sagas to be loaded
export default [
  messageSaga,
];
