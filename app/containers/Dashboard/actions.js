/*
 *
 * Dashboard actions
 *
 */

import {
  FETCH_TINDER_DATA,
  FETCH_TINDER_DATA_ERROR,
  FETCH_TINDER_DATA_SUCCESS,
} from './constants';

export function fetchTinderData() {
  return {
    type: FETCH_TINDER_DATA,
  };
}

export function fetchTinderDataSuccess(){
  return{ 
    type: FETCH_TINDER_DATA_SUCCESS
  };
}

export function fetchTinderDataError(){
  return {
    type: FETCH_TINDER_DATA_ERROR
  };
}
