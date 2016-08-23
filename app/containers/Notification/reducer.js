import {
  GLOBAL_NOTIFICATION_HANDLED,
  GLOBAL_NOTIFICATION_RECEIVED,
  GLOBAL_NOTIFICATION_PUSHED,
  GLOBAL_NOTIFICATION_ADDED,
} from './constants';
import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';

// The initial state of the App
const initialState = fromJS({
  globalNotifications: [],
  currentMessage: '',
});

function authReducer(state = initialState, action) {
  switch (action.type) {
    case GLOBAL_NOTIFICATION_RECEIVED:
      return state
        .set('globalErrors', state.get('globalNotifications').concat(action.payload));
    case GLOBAL_NOTIFICATION_HANDLED:
      return state
        .set('globalErrors', state.get('globalNotifications').shift())
        .set('currentMessage', '');
    case GLOBAL_NOTIFICATION_PUSHED:
      return state.set('currentMessage', action.payload);
    case GLOBAL_NOTIFICATION_ADDED:
      return state;
    case LOCATION_CHANGE:
      return state.set('currentMessage', '');
    default:
      return state;
  }
}

export default authReducer;
