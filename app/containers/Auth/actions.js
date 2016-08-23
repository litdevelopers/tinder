import {
    CHANGE_PASSWORD,
    CHANGE_LOGIN,
    LOGIN_FACEBOOK,
    LOGIN_FACEBOOK_SUCCESS,
    LOGIN_FACEBOOK_ERROR,
    LOGIN_LOCAL,
    LOGIN_LOCAL_SUCCESS,
    SET_GLOBALS,
} from './constants';

export function setGlobals(data) {
  return {
    type: SET_GLOBALS,
    payload: data,
  };
}

export function loginLocal() {
  return {
    type: LOGIN_LOCAL,
  };
}

export function loginLocalSuccess(token) {
  return {
    type: LOGIN_LOCAL_SUCCESS,
    payload: token,
  };
}


export function changeLogin(login) {
  return {
    type: CHANGE_LOGIN,
    payload: login,
  };
}

export function changePassword(password) {
  return {
    type: CHANGE_PASSWORD,
    payload: password,
  };
}

export function loginFacebook() {
  return {
    type: LOGIN_FACEBOOK,
  };
}

export function loginChrome() {
  return {
    type: LOGIN_CHROME,
  };
}

export function loginChromeSuccess({authToken , fbToken}) {
  return {
    type: LOGIN_CHROME_SUCCESS,
    payload: {
      authToken,
      fbToken,
    };
  }
}

export function loginChromeError(err) {
  return {
    type: LOGIN_CHROME_ERROR,
    payload: err
  }
}
export function loginFacebookError(error) {
  return {
    type: LOGIN_FACEBOOK_ERROR,
    payload: error,
  };
}

export function loginFacebookSuccess({ authToken, fbToken }) {
  return {
    type: LOGIN_FACEBOOK_SUCCESS,
    payload: {
      authToken,
      fbToken,
    },
  };
}
