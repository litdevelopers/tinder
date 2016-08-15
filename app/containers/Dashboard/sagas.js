import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeLatest, delay } from 'redux-saga';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  FETCH_TINDER_DATA,
  FETCH_UPDATES,
  FETCH_MATCHES,
} from './constants';

import {
  EDITING_BIO,
} from 'containers/MainDashboard/constants';

import {
  fetchTinderDataSuccess,
  fetchTinderDataError,
  fetchMatchesSuccess,
  fetchMatchesError,
  fetchUpdatesSuccess,
  fetchUpdatesError,
  fetchUpdatesEnd,
} from './actions';

import { newError, newErrorAdded } from 'containers/Notification/actions';

import {
  selectAuthToken,
} from 'containers/Auth/selectors';
import { selectMatches } from 'containers/Recommendations/selectors';
import { postRequest } from 'utils/request';
import { match } from 'utils/schema';

function* getTinderData() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/data`;
  yield call(delay, 1000);
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200 && typeof (data.data[2]) === 'object') {
      // console.log(data.data[1].matches);
      yield put(fetchTinderDataSuccess((data.data)));
    } else if (data.status === 200 && typeof (data.data[2]) === 'string') {
      yield put(fetchTinderDataSuccess(data.data));
      yield put(newError("We're having a little trouble retrieving your matches."));
      yield put(newErrorAdded());
    }
  } catch (error) {
    yield put(fetchTinderDataError(error));
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

function* fetchMatchesAction() {
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/matches`;
  try {
    const data = yield call(postRequest, postURL, { authToken });
    if (data.status === 200 && data.data.length !== 0 && typeof (data.data) === 'object') {
      const currentMatches = yield select(selectMatches());
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

function* updateBioAction(newBio) {
  yield call(delay, 1000);
  const authToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/update/bio`;

  try {
    yield call(postRequest, postURL, { authToken, bio: newBio });
  } catch (error) {
    yield put((newError(error)));
    yield put(newErrorAdded());
  }
}

function* getTinderDataWatcher() {
  while (yield take(FETCH_TINDER_DATA)) {
    yield call(getTinderData);
  }
}

function* updateMatchesWatcher() {
  while (yield take(FETCH_MATCHES)) {
    yield call(fetchMatchesAction);
  }
}

function* getUpdatesWatcher() {
  while (yield take(FETCH_UPDATES)) {
    // starts the task in the background
    yield fork(tinderBackgroundSync);
  }
}

function* getBioUpdatesWatcher() {
  let currentUpdate;
  while (yield take(EDITING_BIO)) {
    const { payload } = yield take(EDITING_BIO);

    if (currentUpdate) {
      yield cancel(currentUpdate);
    }

    currentUpdate = yield fork(updateBioAction, payload);
  }
}


// Individual exports for testing
export function* dashboardSaga() {
  const tinderWatcher = yield fork(getTinderDataWatcher);
  const fetchWatcher = yield fork(updateMatchesWatcher);
  yield fork(getUpdatesWatcher);

  // Profile Editing sagas
  const bioWatcher = yield fork(getBioUpdatesWatcher);


  yield take(LOCATION_CHANGE);
  yield cancel(tinderWatcher);
  yield cancel(fetchWatcher);
  yield cancel(bioWatcher);
}

// All sagas to be loaded
export default [
  dashboardSaga,
];

