/*
 *
 * Messages reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SELECT_PERSON,
} from './constants';

const initialState = fromJS({
  currentPerson: '',
});

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PERSON:
      return state.set('currentPerson', action.payload);
    default:
      return state;
  }
}

export default messagesReducer;
