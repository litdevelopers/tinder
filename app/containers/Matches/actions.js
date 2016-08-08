import {
  LIKE_PERSON,
  LIKE_PERSON_SUCCESS,
  LIKE_PERSON_ERROR,
  PASS_PERSON,
  PASS_PERSON_SUCCESS,
  PASS_PERSON_ERROR,
  DETAIL_PERSON,

} from './constants';


export function likePerson(id) {
  return {
    type: LIKE_PERSON,
    id,
  };
}

export function likePersonSuccess(id) {
  return {
    type: LIKE_PERSON_SUCCESS,
    id,
  };
}

export function likePersonError(errors) {
  return {
    type: LIKE_PERSON_ERROR,
    errors,
  };
}

export function passPerson(id) {
  return {
    type: PASS_PERSON,
    id,
  };
}

export function passPersonSuccess(id) {
  return {
    type: PASS_PERSON_SUCCESS,
    id,
  };
}

export function passPersonError(errors) {
  return {
    type: PASS_PERSON_ERROR,
    errors,
  };
}

export function detailPerson(id) {
  return {
    type: DETAIL_PERSON,
    id,
  };
}
