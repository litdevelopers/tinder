import { createSelector } from 'reselect';
import { selectDashboardHistory } from 'containers/Dashboard/selectors';

import { messagesSortByRecent } from 'utils/operations';
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

const selectPersonId = () => createSelector(
  selectMessages(),
  (messages) => messages.currentPerson,
);

const selectMatchesSelector = () => createSelector(
  selectDashboardHistory(),
  (state) => state.matches.slice().sort((a, b) => messagesSortByRecent(a, b)),
);

const selectPersonSelector = () => createSelector(
  selectDashboardHistory(),
  selectPersonId(),
  (state, id) => {
    if (!id || id === '') {
      return undefined;
    }
    return state.matches.slice().filter((each) => {
      return each.person._id === id;
    })[0];
  }
);

const selectMatchDetailImages = () => createSelector(
  selectPersonSelector(),
  (person) => {
    if (!person || person === '') {
      return undefined;
    }
    return person.person.photos.map((each) => ({ original: each.url }));
  }
);

export {
  selectMessagesDomain,
  selectPersonSelector,
  selectMatchesSelector,
  selectMatchDetailImages,
};
