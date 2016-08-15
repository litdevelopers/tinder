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
  FETCH_UPDATES,
  FETCH_UPDATES_SUCCESS,
  FETCH_UPDATES_ERROR,
  FETCH_UPDATES_END,
  SORT_MATCHES,
} from './constants';

export function fetchUpdates() {
  return {
    type: FETCH_UPDATES,
  };
}

export function sortMatches(sortType) {
  return {
    type: SORT_MATCHES,
    payload: sortType,
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
    user: data[0].user,
    rating: data[0].rating,
    matches: data[1].matches,
    history: {
      blocks: data[1].blocks,
      lists: data[1].lists,
      deleted_lists: data[1].deleted_lists,
      liked_messages: data[1].liked_messages,
      squads: data[1].squads,
      last_activity_date: data[1].last_activity_date,
    },
    recommendations: typeof (data[2]) === 'string' ? null : data[2],
    xAuthToken: data[3],
    payload: data,
  };
}

export function fetchTinderDataError() {
  return {
    type: FETCH_TINDER_DATA_ERROR,
  };
}
