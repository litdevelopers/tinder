import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import { postRequest } from 'utils/request';
import { messagesSortByRecent, storeChunkWithToken, getStoreLength, fetchChunkData, storeToken, getToken } from 'utils/operations';

import {
  NEW_MATCHES,
} from 'containers/Dashboard/constants';


import {
  SEND_MESSAGE,
  FETCH_MATCHES_DATA,
  FETCH_MATCHES_LOCALLY,
  DUMP_ALL_SUCCESS,
  DUMP_ALL_INIT,
  SHOULD_RELOAD_DATA,
} from './constants';
import { selectPointer, selectMatches } from './selectors';

import {
  sendMessageSuccess,
  sendMessageError,
  updatePointer,
  allDataFetched,
  fetchMatchDataError,
  fetchMatchDataSuccess,
  fetchMatchDataUpdate,
  dumpAll,
  dumpAllSuccess,
  reloadDataPlease,
} from './actions';
import { newError, newErrorAdded } from 'containers/Notification/actions';


import {
  selectAuthToken,
} from 'containers/Auth/selectors';


function* newMatchesAction(matches) {
  yield put(fetchMatchDataUpdate(matches));
}

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
        yield call(dumpDataAction, false);
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
export function* dumpDataAction(emptyReducer = true) {
  const preIdList = yield getToken('matchesList');
  if (!preIdList) {
    const data = yield select(selectMatches());
    if (emptyReducer) yield put(dumpAll());
    try {
      const idList = yield storeChunkWithToken(data);
      yield storeToken('matchesList', idList);
      yield put(dumpAllSuccess());
    } catch (error) {
      console.log(error);
    }
  }
}

export function* loadLocalData(additionalFunction = false) {
  const matchesList = yield getToken('matchesList');
  if (matchesList) {
    console.log(matchesList.length);
    console.log('Previous data stored, loading');
    const matches = yield fetchChunkData(matchesList);
    console.log(matches.length);
    yield put(fetchMatchDataSuccess(matches));
    if (additionalFunction) yield put(additionalFunction());
    /*
    * THE REASON WE DO THIS IS BECAUSE PUT DATA HAS RUN TIME OF O(1) and removing data is seamless, so we wait until data is put and then we remove optimistic UI
    */
  } else {
    console.warn('No data found, fetching new chunk');
    yield call(fetchHistoryData);
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

export function* newMatchesWatcher() {
  while (true) {
    const { payload } = yield take(NEW_MATCHES);
    console.log(payload);
    yield call(newMatchesAction, payload);
  }
}

export function* reloadWatcher() {
  while (yield take(SHOULD_RELOAD_DATA)) {
    yield call(loadLocalData, reloadDataPlease);
  }
}


export function* messageSaga() {
  const messageWatcher = yield fork(sendMessageWatcher);
  const dataFetchWatcher = yield fork(dataWatcher);
  const reloadWatch = yield fork(reloadWatcher);
  const newMatchesWatch = yield fork(newMatchesWatcher);
  const dataDumpWatch = yield fork(dumpDataWatcher);
  const dataLoadLocalWatch = yield fork(dataLoadLocalWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(reloadWatch);
  yield cancel(newMatchesWatch);
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
