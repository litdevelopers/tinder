import expect from 'expect';
import dashboardReducer from '../reducer';
import { fromJS } from 'immutable';

describe('dashboardReducer', () => {
  it('returns the initial state', () => {
    expect(dashboardReducer(undefined, {})).toEqual(fromJS({}));
  });
});
