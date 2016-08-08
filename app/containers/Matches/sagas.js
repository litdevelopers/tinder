import { take, takeEvery, call, put, select, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { AUTH_URL } from 'global_constants';

import {
  LIKE_PERSON,
  PASS_PERSON,
} from './constants';

import {
  likePersonSuccess,
  likePersonError,
  passPersonError,
  passPersonSuccess,
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

export function* matchesWatcher() {
  yield takeEvery(LIKE_PERSON, likePersonAction);
  yield takeEvery(PASS_PERSON, passPersonAction);
}

export function* matchesSaga() {
  const watcher = yield fork(matchesWatcher);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}
