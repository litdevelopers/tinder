import { createSelector } from 'reselect';
import { selectMatchesHistory } from 'containers/Dashboard/selectors';

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

const selectCurrentMessage = () => createSelector(
  selectMessages(),
  (messages) => messages.currentMessage,
);

const selectOptimisticUI = () => createSelector(
  selectMessages(),
  (messages) => messages.optimisticUI,
);

const selectMatchesSelector = () => createSelector(
  selectMatchesHistory(),
  (state) => {
    if (!state) return undefined;
    return state;
  },
);

const selectPersonSelector = () => createSelector(
  selectMatchesHistory(),
  selectPersonId(),
  (state, id) => {
    if (!id || id === '' || !state) {
      return undefined;
    }
    return state.slice().filter((each) => {
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

const selectPointer = () => createSelector(
  selectMessages(),
  (substate) => substate.pointer
);

const selectIsAllFetched = () => createSelector(
  selectMessages(),
  (substate) => substate.allMessagesFetched
);

export {
  selectMessagesDomain,
  selectPersonSelector,
  selectPersonId,
  selectMatchesSelector,
  selectMatchDetailImages,
  selectMatchMessages,
  selectCurrentMessage,
  selectOptimisticUI,
  selectPointer,
  selectIsAllFetched,
};
