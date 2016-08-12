import {
  GLOBAL_ERROR_HANDLED,
  GLOBAL_ERROR_RECEIVED,
} from './constants';
import { fromJS } from 'immutable';

// The initial state of the App
const initialState = fromJS({
  globalErrors: [],
  currentError: '',
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case GLOBAL_ERROR_RECEIVED:
      return state
        .set('globalErrors', state.get('globalErrors').concat(action.payload));
    case GLOBAL_ERROR_HANDLED:
      return state
        .set('globalErrors', state.get('globalErrors').splice(1));
    default:
      return state;
  }
}

export default authReducer;
