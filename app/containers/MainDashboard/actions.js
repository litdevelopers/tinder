import {
  EDITING_BIO,
  REORDER_PHOTOS,
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
