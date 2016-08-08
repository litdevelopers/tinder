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
  superLikePerson,
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
}

export function* passPersonAction(action) {

}

export function* superLikePersonAction(action) {

}

export function* matchesWatcher() {
  yield takeLatest(LIKE_PERSON, likePersonAction);
  yield takeLatest(PASS_PERSON, passPersonAction);
  yield takeLatest(SUPERLIKE_PERSON, superLikePersonAction);
}

export function* matchesSaga() {
  const watcher = yield fork(matchesWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}


// All sagas to be loaded
export default [
  matchesSaga,
];
