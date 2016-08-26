import { fromJS, List } from 'immutable';
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
  SORT_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_ERROR,
  FETCH_RECOMMENDATIONS_SUCCESS,
  REMOVE_RECOMMENDATION,
  DUMP_ALL_RECOMMENDATIONS,
  FETCH_RECOMMENDATIONS_LOCALLY,
  SORT_LIKES,
} from './constants';

import {
  matchesSortByDistance,
  matchesSortByLastActive,
  matchesSortByYoungest,
  matchesSortByOldest,
} from 'utils/operations';

const sortMapping = {
  distance: matchesSortByDistance,
  lastActive: matchesSortByLastActive,
  youngest: matchesSortByYoungest,
  oldest: matchesSortByOldest,
};

const initialState = fromJS({
  currentDetailView: {
    id: '',
    image: '',
  },
  lastError: '',
  isFetching: false,
  recommendations: false,
  lastAction: '',
  sortLikes: new Set(),
});

export default function recommendationsReducer(state = initialState, action) {
  switch (action.type) {
    case DETAIL_PERSON:
      return state
        .setIn(['currentDetailView', 'id'], action.id);
    case LIKE_PERSON:
    case PASS_PERSON:
    case SUPERLIKE_PERSON:
    case FETCH_RECOMMENDATIONS_LOCALLY:
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
        .set('lastError', action.payload)
        .set('isFetching', false);
    case FETCH_RECOMMENDATIONS:
      return state.set('isFetching', true);
    case FETCH_RECOMMENDATIONS_SUCCESS:
      return state
        .set('recommendations', action.payload)
        .set('isFetching', false);
    case FETCH_RECOMMENDATIONS_ERROR:
      return state
        .set('isFetching', false)
        .set('lastError', action.payload);
    case SORT_RECOMMENDATIONS:
      return state.set('recommendations', action.payload === 'normal' ? state.get('recommendations') : state.get('recommendations').splice(0).sort(sortMapping[action.payload]));
    case REMOVE_RECOMMENDATION:
      return state
      .set('recommendations', state.get('recommendations').filter((each) => each._id !== action.payload));
    case DUMP_ALL_RECOMMENDATIONS:
      return state
        .set('currentDetailView', fromJS({ id: '', image: '' }))
        .set('recommendations', false);
    case SORT_LIKES:
      return state
        .set('sortLikes', new Set([...state.get('sortLikes'), ...new Set(action.payload)]));
    default:
      return state;
  }
}
