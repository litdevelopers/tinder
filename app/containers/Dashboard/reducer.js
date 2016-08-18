/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_MATCHES,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_ERROR,
  FETCH_UPDATES,
  FETCH_UPDATES_SUCCESS,
  FETCH_UPDATES_END,
  FETCH_UPDATES_ERROR,
  FETCH_DATA,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  REMOVE_MATCH,
  SORT_MATCHES,
  FETCH_DATA_SUCCESS_WITH_CONCAT,
} from './constants';

import {
  EDITING_BIO,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
  SET_GENDER,
  SET_GENDER_FILTER,
  REORDER_PHOTOS,
} from 'containers/MainDashboard/constants';


import {
  matchesSortByDistance,
  matchesSortByLastActive,
  matchesSortByYoungest,
  matchesSortByOldest,
} from 'utils/operations';
import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  user: false,
  rating: false,
  history: false,
  recommendations: false,
  shouldUpdateRecommendations: false,
  lastError: false,
  updates: [],
  isFetching: false,
});

const sortMapping = {
  distance: matchesSortByDistance,
  lastActive: matchesSortByLastActive,
  youngest: matchesSortByYoungest,
  oldest: matchesSortByOldest,
};

function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MATCHES:
    case FETCH_UPDATES:
    case FETCH_DATA:
      return state
        .set('isFetching', true);
    case FETCH_MATCHES_SUCCESS:
      return state
        .set('isFetching', false)
        .set('recommendations', fromJS(action.payload));
    case FETCH_DATA_SUCCESS:
      return state
        .set(action.payload.dataType, fromJS(action.payload.data));
    case FETCH_UPDATES_SUCCESS:
      return state
        .set('isFetching', false)
        .set('updates', (state.get('updates').length > 20) ? state.get('updates').splice(1, 20).concat([action.payload]) : state.get('updates').concat([action.payload]));
    case FETCH_DATA_SUCCESS_WITH_CONCAT:
      return state
        .set('isFetching', false)
        .set(action.payload.dataType, state.get(action.payload.dataType).concat(action.payload.data));
    case FETCH_MATCHES_ERROR:
    case FETCH_UPDATES_ERROR:
    case FETCH_DATA_ERROR:
      return state
        .set('lastError', action.payload)
        .set('isFetching', false);
    case EDITING_BIO:
      return state.setIn(['user', 'bio'], action.payload);
    case SET_AGE_FILTER:
      return state
      .set('recommendations', false)
      .setIn(['user', 'age_filter_max'], action.payload.age_filter_max)
      .setIn(['user', 'age_filter_min'], action.payload.age_filter_min);
    case SET_DISTANCE_FILTER:
      return state
      .set('recommendations', false)
      .setIn(['user', 'distance_filter'], action.payload.distance_filter);
    case SET_GENDER_FILTER:
      return state
      .set('recommendations', false)
      .setIn(['user', 'gender_filter'], action.payload.gender_filter);
    case SET_GENDER:
      return state
      .set('recommendations', false)
      .setIn(['user', 'gender'], action.payload.gender);
    case REORDER_PHOTOS:
      return state.setIn(['user', 'photos'], action.payload);
    case FETCH_UPDATES_END:
      return state
        .set('isFetching', false);
    case LOCATION_CHANGE:
      return state.set('isFetching', false);
    case SORT_MATCHES:
      return state.set('recommendations', action.payload === 'normal' ? state.get('recommendations') : fromJS(state.get('recommendations').toJS().splice(0).sort(sortMapping[action.payload])));
    case REMOVE_MATCH:
      return state
        .set('recommendations', fromJS(state.get('recommendations').toJS().filter((each) => each._id !== action.id)));
    default:
      return state;
  }
}

export default dashboardReducer;
