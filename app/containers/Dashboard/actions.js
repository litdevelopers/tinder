/*
 *
 * Dashboard actions
 *
 */

import {
  FETCH_TINDER_DATA,
  FETCH_TINDER_DATA_ERROR,
  FETCH_TINDER_DATA_SUCCESS,
  FETCH_MATCHES,
  FETCH_MATCHES_SUCCESS,
  FETCH_MATCHES_ERROR,
  REMOVE_MATCH,
} from './constants';

export function removeMatch(id) {
  return {
    type: REMOVE_MATCH,
    id,
  };
}

export function fetchMatches() {
  return {
    type: FETCH_MATCHES,
  };
}

export function fetchMatchesSuccess(data) {
  return {
    type: FETCH_MATCHES_SUCCESS,
    payload: data,
  };
}

export function fetchMatchesError(errors) {
  return {
    type: FETCH_MATCHES_ERROR,
    payload: errors,
  };
}

export function fetchTinderData() {
  return {
    type: FETCH_TINDER_DATA,
  };
}

export function fetchTinderDataSuccess(data) {
  return {
    type: FETCH_TINDER_DATA_SUCCESS,
    user: data[0],
    history: data[1],
    matches: data[2],
    xAuthToken: data[3],
  };
}

export function fetchTinderDataError() {
  return {
    type: FETCH_TINDER_DATA_ERROR,
  };
}
