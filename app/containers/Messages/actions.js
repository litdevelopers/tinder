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
  UNMATCH,
  UNMATCH_SUCCESS,
  UNMATCH_ERROR,
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
  SHOULD_RELOAD_DATA,
  RELOAD_DATA_PLEASE,
  PUSH_NEW_NOTIFICATION,
  READ_NEW_NOTIFICATION,
} from './constants';

export function pushNewNotification(id) {
  return {
    type: PUSH_NEW_NOTIFICATION,
    payload: id,
  };
}

export function readNewNotification(id) {
  return {
    type: READ_NEW_NOTIFICATION,
    payload: id,
  };
}

export function reloadDataPlease() {
  return {
    type: RELOAD_DATA_PLEASE,
  };
}

export function shouldReloadData() {
  return {
    type: SHOULD_RELOAD_DATA,
  };
}

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

export function unmatch(id) {
  return {
    type: UNMATCH,
    payload: {
      id,
    },
  };
}

export function unmatchSuccess() {
  return {
    type: UNMATCH_SUCCESS,
  };
}

export function unmatchError(error) {
  return {
    type: UNMATCH_ERROR,
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
