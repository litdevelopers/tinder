import {
  EDITING_BIO,
} from './constants';

export function editingBio(bioState) {
  return {
    type: EDITING_BIO,
    payload: bioState,
  };
}
