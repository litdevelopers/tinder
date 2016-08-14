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
});

function mainDashboardReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

export default mainDashboardReducer;
