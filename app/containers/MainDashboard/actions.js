import {
  EDITING_BIO,
  REORDER_PHOTOS,
  SET_AGE_FILTER,
  SELECTING_LOCATION,
} from './constants';

export function selectingLocation() {
  return {
    type: SELECTING_LOCATION,
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
