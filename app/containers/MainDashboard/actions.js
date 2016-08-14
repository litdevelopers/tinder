import {
  START_EDITING_BIO,
  FINSHED_EDITING_BIO,
  BIO_UPDATE_START,
  BIO_UPDATE_SUCCESS,
  BIO_UPDATE_FAILED,
} from './constants';

export function startEditingBio() {
  return {
    type: START_EDITING_BIO,
  };
}

export function finishedEditingBio() {
  return {
    type: FINSHED_EDITING_BIO,
  };
}

export function bioUpdateStarted(oldBio, newBio) {
  return {
    type: BIO_UPDATE_START,
    payload: newBio,
  };
}

export function bioUpdateSuccess(newBio) {
  return {
    type: BIO_UPDATE_SUCCESS,
    payload: newBio,
  };
}

export function bioUpdateFailed(oldBio) {
  return {
    type: BIO_UPDATE_FAILED,
    payload: oldBio,
  };
}
