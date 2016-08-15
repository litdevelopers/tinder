import { createSelector } from 'reselect';

const selectMainDashboardDomain = () => state => state.get('userDashboard');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Dashboard
 */

const selectUserDashboard = () => createSelector(
  selectMainDashboardDomain(),
  (substate) => substate.toJS()
);

const selectIsSettingLocation = () => createSelector(
  selectUserDashboard(),
  (substate) => substate.settingLocation
);

export {
  selectUserDashboard,
  selectIsSettingLocation,
};
