import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import { postRequest, getRequest } from 'utils/request';
import { messagesSortByRecent } from 'utils/operations';
import { selectUserID } from 'containers/Dashboard/selectors';
import { selectAuthToken } from 'containers/Auth/selectors';

import {
  SEND_MESSAGE,
  UNMATCH,
  FETCH_MATCHES_LOCALLY,
  DUMP_ALL_SUCCESS,
  DUMP_ALL_INIT,
  SHOULD_RELOAD_DATA,
} from './constants';
import { selectPointer, selectMatches } from './selectors';

import {
  sendMessageSuccess,
  sendMessageError,
  unmatchSuccess,
  unmatchError,
  updatePointer,
  allDataFetched,
  fetchMatchData,
  fetchMatchDataError,
  fetchMatchDataSuccess,
  dumpAll,
  dumpAllSuccess,
  reloadDataPlease,
} from './actions';

import {
  newNotification,
  newNotificationAdded,
} from 'containers/Notification/actions';

import {
  storeChunkWithToken,
  fetchChunkData,
  storeToken,
  getToken,
} from 'utils/storage';

const PUBLIC_GIPHY_API_KEY = 'dc6zaTOxFJmzC';
const PUBLIC_GIPHY_URL = 'http://api.giphy.com/v1/gifs/search';

function* fetchHistoryData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/historynew`;
  const pointer = yield select(selectPointer());
  try {
    yield put(fetchMatchData());
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
    yield put((newNotification(error)));
    yield put(newNotificationAdded());
  }
}

// EXPERIMENTAL
export function* dumpDataAction(emptyReducer = true) {
  const userID = yield select(selectUserID());
  const preIdList = yield getToken(`matchesList_${userID}`);
  if (!preIdList) {
    const data = yield select(selectMatches());
    if (emptyReducer) yield put(dumpAll());
    try {
      const idList = yield storeChunkWithToken(data);
      const currentMatchesList = yield getToken(`matchesList_${userID}`);
      if (!currentMatchesList) {
        yield storeToken(`matchesList_${userID}`, idList);
      }
      yield put(dumpAllSuccess());
    } catch (error) {
      yield put((newNotification(error)));
      yield put(newNotificationAdded());
    }
  } else {
    yield put(dumpAll());
    yield put(dumpAllSuccess());
  }
}

export function* loadLocalData(additionalFunction = false) {
  const userID = yield select(selectUserID());
  const matchesList = yield getToken(`matchesList_${userID}`);
  if (matchesList) {
    const matches = yield fetchChunkData(matchesList);
    yield put(fetchMatchDataSuccess(matches));
    if (additionalFunction) yield put(additionalFunction());
    /*
    * THE REASON WE DO THIS IS BECAUSE PUT DATA HAS RUN TIME OF O(n) and removing data is seamless, so we wait until data is put and then we remove optimistic UI
    */
  } else {
    yield call(fetchHistoryData);
  }
}

// Individual exports for testing
export function* doUnmatch(payload) {
  const userToken = yield select(selectAuthToken());
  const { id } = payload;
  const postURL = `${AUTH_URL}/tinder/unmatch/${id}`;
  try {
    const result = yield call(postRequest, postURL, { userToken });
    if (result.status === 200) {
      yield put(unmatchSuccess());

      const unmatchedId = result.data.id;

      const userID = yield select(selectUserID());
      const matchesList = yield getToken(`matchesList_${userID}`);

      yield storeToken(`matchesList_${userID}`, matchesList.filter((each) => each !== unmatchedId));

      yield call(loadLocalData, reloadDataPlease);
    }
  } catch (error) {
    yield put(unmatchError(error));
    yield put(newNotification(error));
    yield put(newNotificationAdded());
  }
}

function* unmatchWatcher() {
  const unmatchWatch = yield actionChannel(UNMATCH);

  while (true) {
    const { payload } = yield take(unmatchWatch);
    yield doUnmatch(payload);
  }
}

export function* sendMessageData(payload) {
  const userToken = yield select(selectAuthToken());
  const { id } = payload;
  let message;
  if (payload.message.match(/\/gif/)) {
    const gifData = yield call(getRequest, PUBLIC_GIPHY_URL, { api_key: PUBLIC_GIPHY_API_KEY, limit: 1, q: payload.message.split('/gif ')[1] });
    if (gifData.status === 200) {
      message = gifData.data.data[0].images.original.url;
    }
  } else {
    message = payload.message;
  }
  const postURL = `${AUTH_URL}/tinder/message/${id}`;
  try {
    const result = yield call(postRequest, postURL, { userToken, message });
    if (result.status === 200) {
      yield put(sendMessageSuccess());
      const messagedUser = yield getToken(result.data.match_id);
      const userID = yield select(selectUserID());
      const matchesList = yield getToken(`matchesList_${userID}`);

      messagedUser.messages.push(result.data);
      messagedUser.last_activity_date = new Date().toISOString();

      yield storeToken(result.data.match_id, messagedUser);
      yield storeToken(`matchesList_${userID}`, [result.data.match_id].concat(matchesList.filter((each) => each !== result.data.match_id)));
      yield call(loadLocalData, reloadDataPlease);
    }
  } catch (error) {
    yield put(sendMessageError(error));
    yield put(newNotification(error));
    yield put(newNotificationAdded());
  }
}

function* sendMessageWatcher() {
  const messageWatch = yield actionChannel(SEND_MESSAGE);

  while (true) {
    const { payload } = yield take(messageWatch);
    yield sendMessageData(payload);
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

export function* reloadWatcher() {
  while (yield take(SHOULD_RELOAD_DATA)) {
    yield call(loadLocalData, reloadDataPlease);
  }
}


export function* messageSaga() {
  const messageWatcher = yield fork(sendMessageWatcher);
  const unmatchWatch = yield fork(unmatchWatcher);
  const reloadWatch = yield fork(reloadWatcher);
  const dataDumpWatch = yield fork(dumpDataWatcher);
  const dataLoadLocalWatch = yield fork(dataLoadLocalWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(reloadWatch);
  yield cancel(messageWatcher);
  yield cancel(unmatchWatch);
  yield cancel(dataLoadLocalWatch);
  yield take(DUMP_ALL_SUCCESS);
  yield cancel(dataDumpWatch);
}
// All sagas to be loaded
export default [
  messageSaga,
];
