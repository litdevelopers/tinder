import { fromJS } from 'immutable';
import { DETAIL_PERSON } from './constants';

const initialState = fromJS({
  currentDetailView: '',
});

export default function matchesReducer(state = initialState, action) {
  switch (action.type) {
    case DETAIL_PERSON:
      return state.set('currentDetailView', action.id);
    default:
      return state;
  }
}
