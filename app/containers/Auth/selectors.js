import { createSelector } from 'reselect';

const selectAuth = () => (state) => state.get('auth');

const selectLogin = () => createSelector(
  selectAuth(),
  (authState) => authState.get('login')
);

const selectPassword = () => createSelector(
  selectAuth(),
  (authState) => authState.get('password')
);

const selectToken = () => createSelector(
  selectAuth(),
  (authState) => authState.get('userToken')
);

const selectId = () => createSelector(
  selectAuth(),
  (authState) => authState.get('userId')
);

export {
  selectLogin,
  selectPassword,
  selectId,
  selectToken,
};