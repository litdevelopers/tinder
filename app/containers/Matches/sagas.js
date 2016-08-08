import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
} from './constants';

import {
  likePersonSuccess,
  likePersonError,
  passPersonError,
  passPersonSuccess,
  superLikePersonSuccess,
  superLikePersonError,
} from './actions';

import {
  selectToken,
  selectId,
} from 'containers/Auth/selectors';

import { postRequest } from 'utils/request';

export function* likePersonAction(action) {
  const userToken = yield select(selectToken());
  const userId = yield select(selectId());
  const postURL = `${AUTH_URL}/tinder/like`;

  const data = yield call(postRequest, postURL, { userToken, userId, likeUserId: action.id });
  if (data.status === 200) {
    yield put(likePersonSuccess({ id: action.id, action: 'like' }));
  } else {
    yield put(likePersonError(data.data));
  }
}

export function* passPersonAction(action) {
  const userToken = yield select(selectToken());
  const userId = yield select(selectId());
  const postURL = `${AUTH_URL}/tinder/pass`;

  const data = yield call(postRequest, postURL, { userToken, userId, passUserId: action.id });
  if (data.status === 200) {
    yield put(passPersonSuccess({ id: action.id, action: 'pass' }));
  } else {
    yield put(passPersonError(data.data));
  }
}

export function* superLikePersonAction(action) {
  const userToken = yield select(selectToken());
  const userId = yield select(selectId());
  const postURL = `${AUTH_URL}/tinder/superlike`;

  const data = yield call(postRequest, postURL, { userToken, userId, superlikeUserId: action.id });
  if (data.status === 200) {
    yield put(superLikePersonSuccess({ id: action.id, action: 'superlike' }));
  } else {
    yield put(superLikePersonError(data.data));
  }
}
export function* matchesSaga() {
  const watcher = [
    yield fork(takeLatest, LIKE_PERSON, likePersonAction),
    yield fork(takeLatest, SUPERLIKE_PERSON, superLikePersonAction),
    yield fork(takeLatest, PASS_PERSON, passPersonAction),
  ];

  yield take(LOCATION_CHANGE);
  yield watcher.map((each) => cancel(each));
}


// All sagas to be loaded
export default [
  matchesSaga,
];
