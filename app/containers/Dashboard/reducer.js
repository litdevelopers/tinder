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
      return state
        .set('isFetching', true);
    case FETCH_TINDER_DATA_SUCCESS:
      return state
        .set('data', action.payload)
        .set('isFetching', false)
        .set('user', action.user)
        .set('history', action.history)
        .set('matches', action.matches);
    case FETCH_TINDER_DATA_ERROR:
      return state
        .set('errors', action.payload)
        .set('isFetching', false);
    default:
      return state;
  }
}

export default dashboardReducer;
