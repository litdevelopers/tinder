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
} from './constants';


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
