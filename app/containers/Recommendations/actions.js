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
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_ERROR,
  FETCH_RECOMMENDATIONS_SUCCESS,
  FETCH_RECOMMENDATIONS_LOCALLY,
  SORT_RECOMMENDATIONS,
  REMOVE_RECOMMENDATION,
  DUMP_ALL_RECOMMENDATIONS,
  DUMP_ALL_RECOMMENDATIONS_START,
  DUMP_ALL_RECOMMENDATIONS_SUCCESS,
  SORT_LIKES,
} from './constants';

export function superLikePerson(id, hash, details) {
  return {
    type: SUPERLIKE_PERSON,
    id,
    hash,
    details,
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

export function likePerson(id, hash, details) {
  return {
    type: LIKE_PERSON,
    id,
    hash,
    details,
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

export function passPerson(id, hash, details) {
  return {
    type: PASS_PERSON,
    id,
    hash,
    details,
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

export function fetchRecommendations() {
  return {
    type: FETCH_RECOMMENDATIONS,
  };
}

export function fetchRecommendationsLocally() {
  return {
    type: FETCH_RECOMMENDATIONS_LOCALLY,
  };
}

export function fetchRecommendationsSuccess(data) {
  return {
    type: FETCH_RECOMMENDATIONS_SUCCESS,
    payload: data,
  };
}

export function fetchRecommendationsError(errors) {
  return {
    type: FETCH_RECOMMENDATIONS_ERROR,
    payload: errors,
  };
}

export function sortLikes(data) {
  return {
    type: SORT_LIKES,
    payload: data,
  }
}

export function sortRecommendations(sortType) {
  return {
    type: SORT_RECOMMENDATIONS,
    payload: sortType,
  };
}

export function removeRecommendation(id) {
  return {
    type: REMOVE_RECOMMENDATION,
    payload: id,
  };
}

export function dumpAllRecommendationsStart() {
  return {
    type: DUMP_ALL_RECOMMENDATIONS_START,
  };
}

export function dumpAllRecommendations() {
  return {
    type: DUMP_ALL_RECOMMENDATIONS,
  };
}

export function dumpAllRecommendationsSuccess() {
  return {
    type: DUMP_ALL_RECOMMENDATIONS_SUCCESS,
  };
}

