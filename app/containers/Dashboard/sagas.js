import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_DATA,
  FETCH_UPDATES,
  STORE_META_DATA_SUCCESS,
} from './constants';

import {
  fetchDataSuccess,
  fetchDataError,
  fetchUpdatesSuccess,
  fetchUpdatesError,
  fetchUpdatesEnd,
  storeMetadataSuccess,
  newMatches,
  newMessageThread,
} from './actions';

import {
  newError,
  newErrorAdded,
} from 'containers/Notification/actions';

import {
  shouldReloadData,
} from 'containers/Messages/actions';

import { selectAuthToken } from 'containers/Auth/selectors';
import { postRequest } from 'utils/request';
import { storeToken, getToken, storeChunkWithToken, fetchChunkData } from 'utils/operations';


function* getUserData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/user`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200) {
      yield put(fetchDataSuccess('user', data.data.user));
      yield put(fetchDataSuccess('rating', data.data.rating));
    }
  } catch (error) {
    yield put(fetchDataError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

export function* tinderBackgroundSync() {
  try {
    while (true) { // eslint-disable-line
      const authToken = yield select(selectAuthToken());
      const postURL = `${AUTH_URL}/tinder/updatesnew`;
      yield call(delay, 5000);
      try {
        const data = yield call(postRequest, postURL, { authToken });
        // TODO: Support more than matches
        if (data.data.matches.length !== 0) { // eslint-disable-line
          /*
           *One is that the user is on the matches page, and we push to reducer with saga watcher
           *Two is the user is not on the matches page, and we push to indexdb for fetch
           *Cases for new Messages and likes on messages too
           *Flush messages first
           */
          const messageUpdates = data.data.matches.filter((each) => each.is_new_message);
          const matchUpdates = data.data.matches.filter((each) => !each.is_new_message);
          if (messageUpdates.length !== 0) {
            console.log('New message Updates');
            const idList = messageUpdates.map((each) => each._id);
            const dataToBeMutated = yield fetchChunkData(idList);
            const currentMatchesList = yield getToken('matchesList');
            if (!dataToBeMutated) return;

            let iterator = 0;
            for (;iterator < idList.length; iterator++) {
              let inneriter = 0;
              for (;inneriter < messageUpdates[iterator].messages.length; inneriter++) {
                dataToBeMutated[iterator].messages.push(messageUpdates[iterator].messages[inneriter]);
              }
              dataToBeMutated[iterator].last_activity_date = new Date().toISOString();
            }
            // We should probably update the matches list too. I think new messages then new matches.
            const newMessagesList = yield storeChunkWithToken(dataToBeMutated);
            yield storeToken('matchesList', newMessagesList.concat(currentMatchesList.filter((each) => newMessagesList.indexOf(each) === -1)));
          }

          if (matchUpdates.length !== 0) {
            console.warn('New Match in incoming action');
            yield put(newMatches(matchUpdates));
            console.log('Attempted flush to reducer');
            const currentMatchesList = yield getToken('matchesList');
            if (currentMatchesList) { // If the user didn't start storing data locally yet, don't flush to indexD
              console.log('User has stored data, flushing to indexdb');
              const newMatchesList = yield storeChunkWithToken(matchUpdates);
              yield storeToken('matchesList', newMatchesList.concat(currentMatchesList));
            }
          }
          yield put(shouldReloadData());
        }
        yield put(fetchUpdatesSuccess(data.data));
      } catch (error) {
        yield put(fetchUpdatesError(error));
        yield put((newError(error)));
        yield put(newErrorAdded());
      }
    }
  } finally {
    yield put(fetchUpdatesEnd());
  }
}

function* storeMetadataAction() {
  yield storeToken('last_activity_date', new Date().toISOString());
  yield put(storeMetadataSuccess());
}

function* getDataFetchWatcher() {
  while (true) {
    const { payload } = yield take(FETCH_DATA);
    switch (payload) {
      case 'USER_DATA':
        yield fork(getUserData);
        break;
      default:
        return;
    }
  }
}

function* getUpdatesWatcher() {
  while (yield take(FETCH_UPDATES)) {
    // starts the task in the background
    yield fork(tinderBackgroundSync);
  }
}

function* metaDataWatcher() {
  while (yield take(LOCATION_CHANGE)) {
    yield fork(storeMetadataAction);
  }
}

// Individual exports for testing
export function* dashboardSaga() {
  const dataFetchWatcher = yield fork(getDataFetchWatcher);
  const metaDataWatch = yield fork(metaDataWatcher);
  yield fork(getUpdatesWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(dataFetchWatcher);
  yield take(STORE_META_DATA_SUCCESS);
  yield cancel(metaDataWatch);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

