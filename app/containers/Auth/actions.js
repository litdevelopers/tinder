import {
    LOGIN_FACEBOOK,
    LOGIN_FACEBOOK_SUCCESS,
    LOGIN_FACEBOOK_ERROR,
    LOGIN_LOCAL,
    LOGIN_LOCAL_SUCCESS,
    SET_GLOBALS,
    LOGIN_CHROME,
    LOGIN_CHROME_SUCCESS,
    LOGIN_CHROME_ERROR,
    EMPTY_REDUCER,
} from './constants';

export function emptyReducer() {
  return {
    type: EMPTY_REDUCER,
  };
}

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

export function loginFacebook() {
  return {
    type: LOGIN_FACEBOOK,
  };
}

export function loginChrome(token) {
  return {
    type: LOGIN_CHROME,
    payload: token,
  };
}

export function loginChromeSuccess({ authToken, fbToken }) {
  return {
    type: LOGIN_CHROME_SUCCESS,
    payload: {
      authToken,
      fbToken,
    },
  };
}

export function loginChromeError(err) {
  return {
    type: LOGIN_CHROME_ERROR,
    payload: err,
  };
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
