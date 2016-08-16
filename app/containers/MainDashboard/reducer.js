/*
 *
 * Messages reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SELECTING_LOCATION,
} from './constants';

const initialState = fromJS({
  settingLocation: false,
});

function mainDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SELECTING_LOCATION:
      return state.set('settingLocation', !state.get('settingLocation'));
    default:
      return state;
  }
}

export default mainDashboardReducer;
