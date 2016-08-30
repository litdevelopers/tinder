/*
 *
 * Dashboard reducer
 *
 */

import { fromJS } from 'immutable';
import {
  FETCH_UPDATES,
  FETCH_UPDATES_END,
  FETCH_UPDATES_ERROR,
  FETCH_DATA,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  FETCHED_RECOMMENDATIONS_WITH_PREFS,
  UPDATE_ACTIONS_REDUCER,
} from './constants';

import {
  EDITING_BIO,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
  SET_GENDER,
  SET_GENDER_FILTER,
  REORDER_PHOTOS,
  SET_DISCOVER,
  SELECT_LOCATION,
} from 'containers/MainDashboard/constants';

import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  user: false,
  rating: false,
  history: false,
  actionsHistory: [],
  recommendations: false,
  shouldUpdateRecommendations: true,
  lastError: false,
  updates: [],
  isFetching: false,
  isSyncing: false,
});


function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_DATA:
      return state.set('isFetching', true);
    case FETCH_DATA_ERROR:
      return state
      .set('lastError', action.payload)
      .set('isFetching', false);
    case FETCH_DATA_SUCCESS:
      return state.set(action.payload.dataType, fromJS(action.payload.data));
    case FETCH_UPDATES:
      return state.set('isSyncing', true);
    case FETCH_UPDATES_ERROR:
      return state
        .set('lastError', action.payload);
    case FETCH_UPDATES_END:
      return state
        .set('isSyncing', false);
    case UPDATE_ACTIONS_REDUCER:
      return state.set('actionsHistory', action.payload);
    case EDITING_BIO:
      return state.setIn(['user', 'bio'], action.payload);
    case SET_DISCOVER:
      return state
      .set('shouldUpdateRecommendations', true)
      .setIn(['user', 'discoverable'], action.payload.discovery);
    case SET_AGE_FILTER:
      return state
      .set('shouldUpdateRecommendations', true)
      .setIn(['user', 'age_filter_max'], action.payload.age_filter_max)
      .setIn(['user', 'age_filter_min'], action.payload.age_filter_min);
    case SET_DISTANCE_FILTER:
      return state
      .set('shouldUpdateRecommendations', true)
      .setIn(['user', 'distance_filter'], action.payload.distance_filter);
    case SET_GENDER_FILTER:
      return state
      .set('shouldUpdateRecommendations', true)
      .setIn(['user', 'gender_filter'], action.payload.gender_filter);
    case SET_GENDER:
      return state
      .set('shouldUpdateRecommendations', true)
      .setIn(['user', 'gender'], action.payload.gender);
    case REORDER_PHOTOS:
      return state.setIn(['user', 'photos'], action.payload);
    case FETCHED_RECOMMENDATIONS_WITH_PREFS:
      return state.set('shouldUpdateRecommendations', false);
    case SELECT_LOCATION:
      return state.set('shouldUpdateRecommendations', true);
    case LOCATION_CHANGE:
      return state.set('isFetching', false);
    default:
      return state;
  }
}

export default dashboardReducer;
