import { takeLatest } from 'redux-saga';
import { take, call, put, select, fork, cancel, actionChannel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  LIKE_PERSON,
  PASS_PERSON,
  SUPERLIKE_PERSON,
} from './constants';

import { removeMatch, newError } from 'containers/Dashboard/actions';

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

export function* actionPerson(action, type) {
  const userToken = yield select(selectAuthToken());
  const postURL = `${AUTH_URL}/tinder/${type}`;

  try {
    const data = yield call(postRequest, postURL, { userToken, userID: action.id });
    if (data.status === 200) {
      yield put(removeMatch(action.id));
      yield put(detailPerson(''));
      if (type === 'like') yield put(likePersonSuccess({ id: action.id, action: 'like' }));
      if (type === 'superlike') yield put(superLikePersonSuccess({ id: action.id, action: 'superlike' }));
      if (type === 'pass') yield put(passPersonSuccess({ id: action.id, action: 'pass' }));
    }
  } catch (error) {
    if (type === 'like') yield put(likePersonError(error));
    if (type === 'superlike') yield put(superLikePersonError(error));
    if (type === 'pass') yield put(passPersonError(error));
    yield put(newError(error));
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
    if (action.type === LIKE_PERSON) yield actionPerson(action, 'like');
    if (action.type === SUPERLIKE_PERSON) yield actionPerson(action, 'superlike');
    if (action.type === PASS_PERSON) yield actionPerson(action, 'pass');
    if (action.type === LOCATION_CHANGE) yield cancelSaga([actionWatch], watcher);
  }
}


// All sagas to be loaded
export default [
  matchesSaga,
];
