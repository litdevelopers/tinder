import { createSelector } from 'reselect';

const selectNotifications = () => state => state.get('notifications').toJS();

export const selectCurrentError = () => createSelector(
  selectNotifications(),
  (notificationsState) => notificationsState.currentError
);

export const selectQueuedError = () => createSelector(
	selectNotifications(),
	(notificationsState) => notificationsState.globalErrors[0]
);

