/*
 *
 * Dashboard actions
 *
 */

import {
  FETCH_DATA,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_SUCCESS_WITH_CONCAT,
  FETCH_UPDATES,
  FETCH_UPDATES_SUCCESS,
  FETCH_UPDATES_ERROR,
  FETCH_UPDATES_END,
  FETCHED_RECOMMENDATIONS_WITH_PREFS,
} from './constants';

export function fetchDataSuccessWithConcat(dataType, data) {
  return {
    type: FETCH_DATA_SUCCESS_WITH_CONCAT,
    payload: {
      dataType,
      data,
    },
  };
}

export function fetchData(dataType) {
  return {
    type: FETCH_DATA,
    payload: dataType,
  };
}

export function fetchDataError(error) {
  return {
    type: FETCH_DATA_ERROR,
    payload: error,
  };
}

export function fetchDataSuccess(dataType, data) {
  return {
    type: FETCH_DATA_SUCCESS,
    payload: {
      dataType,
      data,
    },
  };
}

export function fetchUpdates() {
  return {
    type: FETCH_UPDATES,
  };
}

export function fetchUpdatesSuccess(data) {
  return {
    type: FETCH_UPDATES_SUCCESS,
    payload: data,
  };
}

export function fetchUpdatesError(errors) {
  return {
    type: FETCH_UPDATES_ERROR,
    payload: errors,
  };
}

export function fetchUpdatesEnd() {
  return {
    type: FETCH_UPDATES_END,
  };
}

export function fetchedRecommendationsWithPrefs() {
  return {
    type: FETCHED_RECOMMENDATIONS_WITH_PREFS,
  };
}
