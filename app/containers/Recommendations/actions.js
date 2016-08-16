import {
  LIKE_PERSON,
  LIKE_PERSON_SUCCESS,
  LIKE_PERSON_ERROR,
  PASS_PERSON,
  PASS_PERSON_SUCCESS,
  PASS_PERSON_ERROR,
  DETAIL_PERSON,
  SUPERLIKE_PERSON,
  SUPERLIKE_PERSON_SUCCESS,
  SUPERLIKE_PERSON_ERROR,
} from './constants';

export function superLikePerson(id, hash) {
  return {
    type: SUPERLIKE_PERSON,
    id,
    hash,
  };
}

export function superLikePersonSuccess(data) {
  return {
    type: SUPERLIKE_PERSON_SUCCESS,
    payload: data,
  };
}

export function superLikePersonError(errors) {
  return {
    type: SUPERLIKE_PERSON_ERROR,
    errors,
  };
}

export function likePerson(id, hash) {
  return {
    type: LIKE_PERSON,
    id,
    hash,
  };
}

export function likePersonSuccess(data) {
  return {
    type: LIKE_PERSON_SUCCESS,
    payload: data,
  };
}

export function likePersonError(errors) {
  return {
    type: LIKE_PERSON_ERROR,
    errors,
  };
}

export function passPerson(id, hash) {
  return {
    type: PASS_PERSON,
    id,
    hash,
  };
}

export function passPersonSuccess(data) {
  return {
    type: PASS_PERSON_SUCCESS,
    payload: data,
  };
}

export function passPersonError(errors) {
  return {
    type: PASS_PERSON_ERROR,
    errors,
  };
}

export function detailPerson(id, image) {
  return {
    type: DETAIL_PERSON,
    id,
    image,
  };
}
