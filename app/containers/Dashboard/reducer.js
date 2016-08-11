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
} from './constants';

const initialState = fromJS({
  user: '',
  history: '',
  matches: '',
  errors: '',
  isFetching: false,
});

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TINDER_DATA:
    case FETCH_MATCHES:
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
    case FETCH_TINDER_DATA_ERROR:
    case FETCH_MATCHES_ERROR:
      return state
        .set('errors', action.payload)
        .set('isFetching', false);
    default:
      return state;
  }
}

export default dashboardReducer;
