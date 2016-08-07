import {
  CHANGE_LOGIN,
  CHANGE_PASSWORD,
  LOGIN_FACEBOOK,
  LOGIN_FACEBOOK_ERROR,
  LOGIN_FACEBOOK_SUCCESS,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  login: '',
  password: '',
  userToken: '',
  userId: '',
  authError: '',
  isAuthing: false,
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_LOGIN:
      // Delete prefixed '@' from the github username
      return state
        .set('login', action.payload);
    case CHANGE_PASSWORD:
      return state
          .set('password', action.payload);
    case LOGIN_FACEBOOK:
      return state
          .set('isAuthing', true);
    case LOGIN_FACEBOOK_SUCCESS:
      return state
          .set('userToken', action.payload.token)
          .set('userId', action.payload.id)
          .set('isAuthing', false);
    case LOGIN_FACEBOOK_ERROR:
      return state
          .set('authError', action.payload)
          .set('isAuthing', false);
    default:
      return state;
  }
}

export default authReducer;
