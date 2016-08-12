/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_TINDER_DATA,
  FETCH_TINDER_DATA_ERROR,
  FETCH_TINDER_DATA_SUCCESS,
  FETCH_MATCHES,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_ERROR,
  FETCH_UPDATES,
  FETCH_UPDATES_SUCCESS,
  FETCH_UPDATES_ERROR,
  REMOVE_MATCH,
} from './constants';

const initialState = fromJS({
  user: '',
  history: '',
  matches: '',
  updates: [],
  errors: '',
  isFetching: false,
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TINDER_DATA:
    case FETCH_MATCHES:
    case FETCH_UPDATES:
      return state
        .set('isFetching', true);
    case FETCH_MATCHES_SUCCESS:
      return state
        .set('matches', action.payload);
    case FETCH_TINDER_DATA_SUCCESS:
      return state
        .set('data', action.payload)
        .set('isFetching', false)
        .set('user', action.user)
        .set('history', action.history)
        .set('matches', action.matches);
    case FETCH_UPDATES_SUCCESS:
      return state
        .set('updates', state.get('updates').concat([action.payload]));
    case FETCH_TINDER_DATA_ERROR:
    case FETCH_MATCHES_ERROR:
    case FETCH_UPDATES_ERROR:
      return state
        .set('errors', action.payload)
        .set('isFetching', false);
    case REMOVE_MATCH:
      return state
        .set('matches', state.get('matches').filter((each) => each._id !== action.id));
    default:
      return state;
  }
}

export default dashboardReducer;
