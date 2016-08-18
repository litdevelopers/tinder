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

const selectMatches = () => createSelector(
  selectMessages(),
  (substate) => substate.matches
);

const selectPersonId = () => createSelector(
  selectMessages(),
  (messages) => messages.currentPerson,
);

const selectCurrentMessage = () => createSelector(
  selectMessages(),
  (messages) => messages.currentMessage,
);

const selectOptimisticUI = () => createSelector(
  selectMessages(),
  (messages) => messages.optimisticUI,
);

const selectPersonSelector = () => createSelector(
  selectMatches(),
  selectPersonId(),
  (state, id) => {
    if (!id || id === '' || !state) {
      return undefined;
    }
    return state.slice().filter((each) => {
      if (!each.person) return false;
      return each.person._id === id; // eslint-disable-line no-underscore-dangle
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
      if (person.person._id === each.to) {  // eslint-disable-line no-underscore-dangle
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

const selectPointer = () => createSelector(
  selectMessages(),
  (substate) => substate.pointer
);

const selectIsAllFetched = () => createSelector(
  selectMessages(),
  (substate) => substate.allMessagesFetched
);

const selectIsFetching = () => createSelector(
  selectMessages(),
  (substate) => substate.isFetching
);

export {
  selectMessagesDomain,
  selectPersonSelector,
  selectPersonId,
  selectMatchDetailImages,
  selectMatchMessages,
  selectCurrentMessage,
  selectOptimisticUI,
  selectPointer,
  selectIsAllFetched,
  selectIsFetching,
  selectMatches,
};
