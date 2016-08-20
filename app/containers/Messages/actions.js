/*
 *
 * Messages actions
 *
 */

import {
  SELECT_PERSON,
  SEND_MESSAGE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  CHANGE_MESSAGE,
  ALL_DATA_FETCHED,
  UPDATE_POINTER,
  FETCH_MATCHES_DATA,
  FETCH_MATCHES_DATA_ERROR,
  FETCH_MATCHES_DATA_SUCCESS,
  FETCH_MATCHES_LOCALLY,
  FETCH_MATCHES_DATA_NEW,
  DUMP_ALL,
  DUMP_ALL_SUCCESS,
  DUMP_ALL_INIT,
} from './constants';

export function fetchMatchData() {
  return {
    type: FETCH_MATCHES_DATA,
  };
}

export function fetchMatchDataSuccess(data) {
  return {
    type: FETCH_MATCHES_DATA_SUCCESS,
    payload: data,
  };
}

export function fetchMatchDataError(error) {
  return {
    type: FETCH_MATCHES_DATA_ERROR,
    payload: error,
  };
}

export function allDataFetched() {
  return {
    type: ALL_DATA_FETCHED,
  };
}

export function changeMessage(message) {
  return {
    type: CHANGE_MESSAGE,
    payload: message,
  };
}
export function selectPersonAction(id) {
  return {
    type: SELECT_PERSON,
    payload: id,
  };
}

export function sendMessage(id, message) {
  return {
    type: SEND_MESSAGE,
    payload: {
      id,
      message,
    },
  };
}

export function sendMessageSuccess() {
  return {
    type: SEND_MESSAGE_SUCCESS,
  };
}

export function sendMessageError(error) {
  return {
    type: SEND_MESSAGE_ERROR,
    payload: error,
  };
}

export function updatePointer() {
  return {
    type: UPDATE_POINTER,
  };
}

// Experimental
export function dumpAll() {
  return {
    type: DUMP_ALL,
  };
}

export function dumpAllSuccess() {
  return {
    type: DUMP_ALL_SUCCESS,
  };
}

export function dumpAllInit() {
  return {
    type: DUMP_ALL_INIT,
  };
}

export function fetchMatchDataLocally() {
  return {
    type: FETCH_MATCHES_LOCALLY,
  };
}

export function fetchMatchDataUpdate(matches) {
  return {
    type: FETCH_MATCHES_DATA_NEW,
    payload: matches,
  };
}
