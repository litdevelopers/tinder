/*
 *
 * Dashboard actions
 *
 */

import {
  FETCH_DATA,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  FETCH_UPDATES,
  FETCH_UPDATES_ERROR,
  FETCH_UPDATES_END,
  FETCHED_RECOMMENDATIONS_WITH_PREFS,
  STORE_META_DATA_SUCCESS,
  REHYDRATE_MATCHES,
  REHYDRATE_MATCHES_SUCCESS,
  REHYDRATE_MATCHES_ERROR,
} from './constants';

export function rehydrateMatches() {
  return {
    type: REHYDRATE_MATCHES,
  };
}

export function rehydrateMatchesSuccess() {
  return {
    type: REHYDRATE_MATCHES_SUCCESS,
  };
}

export function rehydrateMatchesError() {
  return {
    type: REHYDRATE_MATCHES_ERROR,
  };
}

export function storeMetadataSuccess() {
  return {
    type: STORE_META_DATA_SUCCESS,
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
