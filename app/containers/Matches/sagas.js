import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
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

export function* cancelSaga(channels, watcher) {
  watcher.map((each) => cancel(each));
  channels.map((each) => each.close());
}

export function* matchesSaga() {
  const watcher = [
    yield fork(takeLatest, FETCH_MATCHES, fetchMatchesAction),
  ];

  const actionWatch = yield actionChannel([LIKE_PERSON, SUPERLIKE_PERSON, PASS_PERSON, LOCATION_CHANGE]);
  while (true) { // eslint-disable-line
    const action = yield take(actionWatch);
    if (action.type === LIKE_PERSON) yield likePersonAction(action);
    if (action.type === SUPERLIKE_PERSON) yield superLikePersonAction(action);
    if (action.type === PASS_PERSON) yield passPersonAction(action);
    if (action.type === LOCATION_CHANGE) yield cancelSaga([actionWatch], watcher);
  }
}


// All sagas to be loaded
export default [
  matchesSaga,
];
