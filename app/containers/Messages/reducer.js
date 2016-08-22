/*
 *
 * Messages reducer
 *
 */

import { fromJS, List } from 'immutable';
import {
  SELECT_PERSON,
  SEND_MESSAGE,
  SEND_MESSAGE_ERROR,
  SEND_MESSAGE_SUCCESS,
  UPDATE_POINTER,
  ALL_DATA_FETCHED,
  FETCH_MATCHES_DATA,
  FETCH_MATCHES_DATA_ERROR,
  FETCH_MATCHES_DATA_SUCCESS,
  FETCH_MATCHES_DATA_NEW,
  DUMP_ALL,
  RELOAD_DATA_PLEASE,
  PUSH_NEW_NOTIFICATION,
} from './constants';

import { LOCATION_CHANGE } from 'react-router-redux';

const initialState = fromJS({
  pointer: 1,
  allMessagesFetched: false,
  currentPerson: '',
  fetchingErrors: '',
  isSending: false,
  matches: false,
  isFetching: false,
  optimisticUI: [],
  newMatches: [],
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
        .set('matches', new List(action.payload))
        .set('isFetching', false);
    case FETCH_MATCHES_DATA_NEW:
      return state.set('matches', action.payload.concat(state.get('matches')));
    case SELECT_PERSON:
      return state
      .set('currentPerson', action.payload)
      .set('newMatches', state.get('newMatches').filter((each) => each !== action.payload));
    case SEND_MESSAGE:
      return state
        .set('isSending', true)
        .set('optimisticUI', state.get('optimisticUI').concat(action.payload));
    case SEND_MESSAGE_ERROR:
      return state.set('isSending', false);
    case SEND_MESSAGE_SUCCESS:
      return state.set('isSending', false);
    case UPDATE_POINTER:
      return state.set('pointer', state.get('pointer') + 1);
    case ALL_DATA_FETCHED:
      return state.set('allMessagesFetched', true);
    case DUMP_ALL:
      return state
      .set('optimisticUI', [])
      .set('matches', []);
    case LOCATION_CHANGE:
      return state
      .set('optimisticUI', [])
      .set('currentPerson', '');
    case RELOAD_DATA_PLEASE:
      return state
      .set('optimisticUI', []);
    case PUSH_NEW_NOTIFICATION:
      return state.set('newMatches', state.get('newMatches').concat(action.payload.filter((each) => each !== state.get('currentPerson'))));
    default:
      return state;
  }
}

export default messagesReducer;
