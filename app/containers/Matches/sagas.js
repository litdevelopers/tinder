import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { delay } from 'redux-saga/utils';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
} from './constants';

import { removeMatch } from 'containers/Dashboard/actions';

import {
  likePersonSuccess,
  likePersonError,
  passPersonError,
  passPersonSuccess,
  superLikePersonSuccess,
  superLikePersonError,
  detailPerson,
} from './actions';

import {
  selectAuthToken,
} from 'containers/Auth/selectors';

import { FETCH_MATCHES } from 'containers/Dashboard/constants';
import { fetchMatchesAction } from 'containers/Dashboard/sagas';

import { postRequest } from 'utils/request';

export function* likePersonAction(action) {
  const userToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/like`;
  try {
    const data = yield call(postRequest, postURL, { userToken, likeUserId: action.id });
    if (data.status === 200) {
      yield put(removeMatch(action.id));
      yield put(detailPerson(''));
      yield put(likePersonSuccess({ id: action.id, action: 'like' }));
    }
  } catch (error) {
    yield put(likePersonError(error));
  }
}

export function* passPersonAction(action) {
  const userToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/pass`;

  try {
    delay(200);
    const data = yield call(postRequest, postURL, { userToken, passUserId: action.id });
    if (data.status === 200) {
      yield put(removeMatch(action.id));
      yield put(detailPerson(''));
      yield put(passPersonSuccess({ id: action.id, action: 'pass' }));
    }
  } catch (error) {
    yield put(passPersonError(error));
  }
}

export function* superLikePersonAction(action) {
  const userToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/superlike`;

  try {
    delay(200);
    const data = yield call(postRequest, postURL, { userToken, superlikeUserId: action.id });
    if (data.status === 200) {
      yield put(removeMatch(action.id));
      yield put(detailPerson(''));
      yield put(superLikePersonSuccess({ id: action.id, action: 'pass' }));
    }
  } catch (error) {
    yield put(superLikePersonError(error));
  }
}


export function* matchesSaga() {
  const watcher = [
    yield fork(takeLatest, LIKE_PERSON, likePersonAction),
    yield fork(takeLatest, SUPERLIKE_PERSON, superLikePersonAction),
    yield fork(takeLatest, PASS_PERSON, passPersonAction),
    yield fork(takeLatest, FETCH_MATCHES, fetchMatchesAction),
  ];

  yield take(LOCATION_CHANGE);
  yield watcher.map((each) => cancel(each));
}


// All sagas to be loaded
export default [
  matchesSaga,
];
