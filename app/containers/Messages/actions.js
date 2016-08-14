/*
 *
 * Messages actions
 *
 */

import {
  SELECT_PERSON,
} from './constants';

export function selectPersonAction(id) {
  return {
    type: SELECT_PERSON,
    payload: id,
  };
}
