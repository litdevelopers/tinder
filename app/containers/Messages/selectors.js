import { createSelector } from 'reselect';

/**
 * Direct selector to the messages state domain
 */
const selectMessagesDomain = () => state => state.get('messages');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Messages
 */

const selectMessages = () => createSelector(
  selectMessagesDomain(),
  (substate) => substate.toJS()
);

export default selectMessages;
export {
  selectMessagesDomain,
};
