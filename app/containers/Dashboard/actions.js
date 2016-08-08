/*
 *
 * Dashboard actions
 *
 */

import {
  FETCH_TINDER_DATA,
  FETCH_TINDER_DATA_ERROR,
  FETCH_TINDER_DATA_SUCCESS,
} from './constants';

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
