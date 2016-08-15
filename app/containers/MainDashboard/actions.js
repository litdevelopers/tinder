import {
  EDITING_BIO,
  REORDER_PHOTOS,
} from './constants';

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
