import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_DATA,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  FETCH_USER_DATA,
  FETCH_UPDATES,
  FETCH_MATCHES,
} from './constants';

import {
  fetchDataSuccess,
  fetchDataError,
  fetchMatchesSuccess,
  fetchMatchesError,
  fetchUpdatesSuccess,
  fetchUpdatesError,
  fetchUpdatesEnd,
  fetchDataSuccessWithConcat,
} from './actions';

import { updatePointer, allDataFetched } from 'containers/Messages/actions';
import { newError, newErrorAdded } from 'containers/Notification/actions';

import { selectMatchesLength } from './selectors';
import { selectPointer } from 'containers/Messages/selectors';
import { selectAuthToken } from 'containers/Auth/selectors';
import { selectMatches } from 'containers/Recommendations/selectors';
import { postRequest } from 'utils/request';
import { messagesSortByRecent } from 'utils/operations';


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

function* fetchHistoryData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/historynew`;
  const pointer = yield select(selectPointer());
  try {
    const data = yield call(postRequest, postURL, { authToken, pointer });
    if (data.status === 200) {
      const { matches, final, ...rest } = data.data;
      yield put(fetchDataSuccess('history', rest));
      yield put(fetchDataSuccessWithConcat('matches', matches.slice().sort((a, b) => messagesSortByRecent(a, b))));
      if (final) {
        yield put(allDataFetched());
      } else {
        yield put(updatePointer());
      }
    }
  } catch (error) {
    yield put(fetchDataError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

function* fetchMatchesAction() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/recommendations`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200 && data.data.length !== 0 && typeof (data.data) === 'object') {
      const currentMatches = yield select(selectMatches());
      if (!currentMatches) {
        yield put(fetchMatchesSuccess(data.data));
      } else {
        const filteredNewMatches = data.data.filter((each) => {
          let flag = true;
          let counter = 0;
          for (; counter < currentMatches.length; counter++) {
            if (currentMatches[counter]._id === each._id) { // eslint-disable-line no-underscore-dangle
              console.log(each.name);
              flag = false;
            }
          }
          return flag;
        });
        yield put(fetchMatchesSuccess(currentMatches.concat(filteredNewMatches)));
      }
    } else {
      yield put(newError("We're having a little trouble retrieving your matches."));
      yield put(newErrorAdded());
    }
  } catch (error) {
    yield put(fetchMatchesError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}


export function* tinderBackgroundSync() {
  try {
    while (true) { // eslint-disable-line
      const authToken = yield select(selectAuthToken());
      const postURL = `${AUTH_URL}/tinder/updates`;
      yield call(delay, 15000);
      try {
        const data = yield call(postRequest, postURL, { authToken });
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

function* getDataFetchWatcher() {
  while (true) {
    const { payload } = yield take(FETCH_DATA);
    switch (payload) {
      case 'USER_DATA':
        yield fork(getUserData);
        break;
      case 'RECOMMENDATIONS_DATA':
        yield fork(fetchMatchesAction);
        break;
      case 'HISTORY_DATA':
        yield fork(fetchHistoryData);
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

// Individual exports for testing
export function* dashboardSaga() {
  const dataFetchWatcher = yield fork(getDataFetchWatcher);
  yield fork(getUpdatesWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(dataFetchWatcher);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

