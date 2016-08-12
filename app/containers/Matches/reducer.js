import { fromJS } from 'immutable';
import {
  SUPERLIKE_PERSON,
  PASS_PERSON,
  LIKE_PERSON,
  SUPERLIKE_PERSON_SUCCESS,
  SUPERLIKE_PERSON_ERROR,
  LIKE_PERSON_SUCCESS,
  LIKE_PERSON_ERROR,
  PASS_PERSON_SUCCESS,
  PASS_PERSON_ERROR,
  DETAIL_PERSON,
} from './constants';


const initialState = fromJS({
  currentDetailView: {
    id: '',
    image: '',
  },
  errors: '',
  isFetching: false,
  newMatches: '',
  lastAction: '',
});

export default function matchesReducer(state = initialState, action) {
  switch (action.type) {
    case DETAIL_PERSON:
      return state
        .setIn(['currentDetailView', 'id'], action.id);
    case LIKE_PERSON:
    case PASS_PERSON:
    case SUPERLIKE_PERSON:
      return state.set('isFetching', true);
    case LIKE_PERSON_SUCCESS:
    case PASS_PERSON_SUCCESS:
    case SUPERLIKE_PERSON_SUCCESS:
      return state
        .set('isFetching', false)
        .set('lastAction', action.payload);
    case LIKE_PERSON_ERROR:
    case SUPERLIKE_PERSON_ERROR:
    case PASS_PERSON_ERROR:
      return state
        .set('errors', action.payload)
        .set('isFetching', false);
    default:
      return state;
  }
}
