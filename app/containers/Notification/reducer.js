import {
  GLOBAL_ERROR_HANDLED,
  GLOBAL_ERROR_RECEIVED,
  GLOBAL_ERROR_PUSHED,
  GLOBAL_ERROR_ADDED,
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
        .set('globalErrors', state.get('globalErrors').splice(1))
        .set('currentError', '');
    case GLOBAL_ERROR_PUSHED:
      return state.set('currentError', action.payload);
    case GLOBAL_ERROR_ADDED:
      return state;
    default:
      return state;
  }
}

export default authReducer;
