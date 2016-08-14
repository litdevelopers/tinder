import expect from 'expect';
import messagesReducer from '../reducer';
import { fromJS } from 'immutable';

describe('messagesReducer', () => {
  it('returns the initial state', () => {
    expect(messagesReducer(undefined, {})).toEqual(fromJS({}));
  });
});
