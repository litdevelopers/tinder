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
    if (!id || id === '' || !state) {
      return undefined;
    }
    return state.matches.slice().filter((each) => {
      if (!each.person) return false;
      return each.person._id === id;
    })[0];
  }
);

const selectMatchDetailImages = () => createSelector(
  selectPersonSelector(),
  (person) => {
    if (!person || person === '' || !person.person) {
      return undefined;
    }
    return person.person.photos.map((each) => ({ original: each.url }));
  }
);

const selectMatchMessages = () => createSelector(
  selectPersonSelector(),
  (person) => {
    if (!person) {
      return undefined;
    }
    return person.messages.slice().map((each) => {
      // console.log('from', each.from);
      // console.log('slice', person._id.slice(0, 24));
      // console.log('to', each.to);
      if (person._id.indexOf(each.to)) {
        return {
          from: 'you',
          payload: each,
        };
      }
      return {
        from: 'me',
        payload: each,
      };
    });
  }
);

export {
  selectMessagesDomain,
  selectPersonSelector,
  selectMatchesSelector,
  selectMatchDetailImages,
  selectMatchMessages,
};
