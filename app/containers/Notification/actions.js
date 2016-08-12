import {
  GLOBAL_ERROR_HANDLED,
  GLOBAL_ERROR_RECEIVED,
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
