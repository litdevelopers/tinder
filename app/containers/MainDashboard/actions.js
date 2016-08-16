import {
  EDITING_BIO,
  REORDER_PHOTOS,
  SET_AGE_FILTER,
  SET_DISTANCE_FILTER,
  SELECTING_LOCATION,
  SELECT_LOCATION,
} from './constants';

export function selectingLocation() {
  return {
    type: SELECTING_LOCATION,
  };
}

export function selectLocation(lat, lng) {
  return {
    type: SELECT_LOCATION,
    payload: {
      lat,
      lng,
    },
  };
}

export function editingBio(bioState) {
  return {
    type: EDITING_BIO,
    payload: bioState,
  };
}

export function reorderPhotos(photos) {
  return {
    type: REORDER_PHOTOS,
    payload: photos,
  };
}

export function setAgeFilter(newFilter) {
  return {
    type: SET_AGE_FILTER,
    payload: {
      age_filter_min: newFilter[0],
      age_filter_max: newFilter[1],
    },
  };
}

export function setDistanceFilter(newFilter) {
  return {
    type: SET_DISTANCE_FILTER,
    payload: {
      distance_filter: newFilter[0],
    },
  };
}

