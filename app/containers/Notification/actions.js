import {
  GLOBAL_ERROR_HANDLED,
  GLOBAL_ERROR_RECEIVED,
  GLOBAL_ERROR_PUSHED,
  GLOBAL_ERROR_ADDED
} from './constants';

export function newError(errors) {
  return {
    type: GLOBAL_ERROR_RECEIVED,
    payload: errors,
  };
}

export function handledError() {
  return {
    type: GLOBAL_ERROR_HANDLED,
  };
}

export function pushError(error) {
  return {
    type: GLOBAL_ERROR_PUSHED,
    payload: error,
  };
}

export function newErrorAdded() {
  return {
    type: GLOBAL_ERROR_ADDED,
  };
}
