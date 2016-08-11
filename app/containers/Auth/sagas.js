import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { LOCATION_CHANGE, push } from 'react-router-redux';

import { LOGIN_FACEBOOK, LOGIN_LOCAL } from './constants';
import { loginFacebookSuccess, loginFacebookError, setGlobals } from './actions';
import { postRequest } from 'utils/request';
import { storeAuthToken, getAuthToken } from 'utils/operations';
import { AUTH_URL } from 'global_constants';
import { selectLogin, selectPassword } from './selectors';

export function* loginFacebookSaga() {
  const login = yield select(selectLogin());
  const password = yield select(selectPassword());
  const requestURL = `${AUTH_URL}/auth/facebook`;
  const body = {
    login,
    password,
  };

  const authData = yield call(postRequest, requestURL, body);
  if (authData.status === 200) {
    yield storeAuthToken('tinderToken', authData.data.authToken);
    yield storeAuthToken('fbToken', authData.data.fbToken);
    yield put(loginFacebookSuccess({ authToken: authData.data.authToken, fbToken: authData.data.fbToken }));
    yield put(setGlobals(authData.data.defaults));
    yield put(push('/dashboard'));
  } else {
    yield put(loginFacebookError(authData.data.errors));
  }
}

export function* loginLocalSaga() {
  try {
    const fbToken = yield getAuthToken('fbToken');
    const authToken = yield getAuthToken('tinderToken');
    if (authToken && fbToken) {
      yield put(loginFacebookSuccess({ authToken, fbToken }));
      yield put(push('/dashboard'));
    }
  } catch (err) {
    console.log(err);
  }
}



export function* authSaga() {
  const watcher = [
    yield fork(takeLatest, LOGIN_FACEBOOK, loginFacebookSaga),
    yield fork(takeLatest, LOGIN_LOCAL, loginLocalSaga),
  ];

  yield take(LOCATION_CHANGE);
  yield watcher.map(each => cancel(each));
}

export default [
  authSaga,
];
