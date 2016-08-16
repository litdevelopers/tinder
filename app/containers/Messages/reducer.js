/*
 *
 * Messages reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SELECT_PERSON,
  CHANGE_MESSAGE,
  SEND_MESSAGE,
  SEND_MESSAGE_ERROR,
  SEND_MESSAGE_SUCCESS,
} from './constants';

const initialState = fromJS({
  currentPerson: '',
  currentMessage: '',
  isSending: false,
  optimisticUI: [],
});

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_PERSON:
      return state.set('currentPerson', action.payload);
    case CHANGE_MESSAGE:
      return state.set('currentMessage', action.payload);
    case SEND_MESSAGE:
      console.log(action);
      return state
        .set('isSending', true)
        .set('optimisticUI', fromJS(state.get('optimisticUI')).concat(action.payload.message))
        .set('currentMessage', '');
    case SEND_MESSAGE_ERROR:
      return state.set('isSending', false);
    case SEND_MESSAGE_SUCCESS:
      return state.set('isSending', false);
    default:
      return state;
  }
}

export default messagesReducer;
