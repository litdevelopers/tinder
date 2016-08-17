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
} from './constants';

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
