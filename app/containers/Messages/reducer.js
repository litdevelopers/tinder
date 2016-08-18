/*
 *
 * Messages reducer
 *
 */

import { fromJS, Seq } from 'immutable';
import {
  SELECT_PERSON,
  CHANGE_MESSAGE,
  SEND_MESSAGE,
  SEND_MESSAGE_ERROR,
  SEND_MESSAGE_SUCCESS,
  UPDATE_POINTER,
  ALL_DATA_FETCHED,
  FETCH_MATCHES_DATA,
  FETCH_MATCHES_DATA_ERROR,
  FETCH_MATCHES_DATA_SUCCESS,
  DUMP_ALL,
} from './constants';

const initialState = fromJS({
  pointer: 1,
  allMessagesFetched: false,
  currentPerson: '',
  fetchingErrors: '',
  isSending: false,
  matches: false,
  isFetching: false,
  optimisticUI: [],
});

function messagesReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MATCHES_DATA:
      return state
        .set('optimisticUI', [])
        .set('isFetching', true);
    case FETCH_MATCHES_DATA_ERROR:
      return state
        .set('fetchingErrors', action.payload)
        .set('isFetching', false);
    case FETCH_MATCHES_DATA_SUCCESS:
      return state
        .set('matches', new Seq(action.payload))
        .set('isFetching', false);
    case SELECT_PERSON:
      return state.set('currentPerson', action.payload);
    case CHANGE_MESSAGE:
      return state.set('currentMessage', action.payload);
    case SEND_MESSAGE:
      return state
        .set('isSending', true)
        .set('optimisticUI', fromJS(state.get('optimisticUI')).push(fromJS(action.payload)))
        .set('currentMessage', '');
    case SEND_MESSAGE_ERROR:
      return state.set('isSending', false);
    case SEND_MESSAGE_SUCCESS:
      return state.set('isSending', false);
    case UPDATE_POINTER:
      return state.set('pointer', state.get('pointer') + 1);
    case ALL_DATA_FETCHED:
      return state.set('allMessagesFetched', true);
    case DUMP_ALL:
      return state.set('matches', []);
    default:
      return state;
  }
}

export default messagesReducer;
