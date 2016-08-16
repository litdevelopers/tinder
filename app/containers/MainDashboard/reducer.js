/*
 *
 * Messages reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SELECTING_LOCATION,
  SELECT_LOCATION,
} from './constants';

const initialState = fromJS({
  settingLocation: false,
  mapPinLocation: {
    lat: '',
    lng: '',
  },
});

function mainDashboardReducer(state = initialState, action) {
  switch (action.type) {
    case SELECTING_LOCATION:
      return state.set('settingLocation', !state.get('settingLocation'));
    case SELECT_LOCATION:
      return state.setIn(['mapPinLocation', 'lat'], action.payload.lat).setIn(['mapPinLocation', 'lng'], action.payload.lng);
    default:
      return state;
  }
}

export default mainDashboardReducer;
