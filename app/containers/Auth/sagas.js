import { take, call, put, select, fork, cancel } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import { LOGIN_FACEBOOK, LOGIN_LOCAL } from './constants';
import { loginFacebookSuccess, loginFacebookError, setGlobals } from './actions';
import { postRequest } from 'utils/request';
import { storeToken, getToken } from 'utils/operations';
import { AUTH_URL } from 'global_constants';
import { selectLogin, selectPassword } from './selectors';

function* loginFacebookSaga() {
  const login = yield select(selectLogin());
  const password = yield select(selectPassword());
  const requestURL = `${AUTH_URL}/auth/facebook`;
  const body = {
    login,
    password,
  };
  try {
    const authData = yield call(postRequest, requestURL, body);
    if (authData.status === 200) {
      yield storeToken('tinderToken', authData.data.authToken);
      yield storeToken('fbToken', authData.data.fbToken);
      yield put(loginFacebookSuccess({ authToken: authData.data.authToken, fbToken: authData.data.fbToken }));
      yield put(push('/dashboard/home'));
    }
  } catch (loginError) {
    yield put(loginFacebookError(loginError));
  }
}

function* loginLocalSaga() {
  const authToken = yield getToken('tinderToken');

  try {
    const authenticationData = yield call(postRequest, `${AUTH_URL}/tinder/checkAuth`, { authToken });
    if(authenticationData.data){
      yield put(loginFacebookSuccess({ authToken }))
      yield put(push('/dashboard/home'));
    }
  } catch(err) {
    console.log('Could not login locally with stored auth token. Fall back to fresh login.');
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
