import { createSelector } from 'reselect';

const selectNotifications = () => state => state.get('notifications').toJS();

export const selectCurrentError = () => createSelector(
  selectNotifications(),
  (notificationsState) => notificationsState.currentMessage
);
