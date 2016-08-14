/*
 *
 * Messages reducer
 *
 */

import { fromJS } from 'immutable';
import {
  INITIAL_SET_USER_OBJECT,
} from './constants';

const initialState = fromJS({
  userObject: '',
});

function mainDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case INITIAL_SET_USER_OBJECT:
      return state.set('userObject', action.payload);
    default:
      return state;
  }
}

export default mainDashboardReducer;
