import { createSelector } from 'reselect';

/**
 * Direct selector to the dashboard state domain
 */
const selectDashboardDomain = () => state => state.get('dashboard');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Dashboard
 */

const selectDashboard = () => createSelector(
  selectDashboardDomain(),
  (substate) => {
    if (!substate) {
      return undefined;
    }
    return substate.toJS()
  }
);

const selectFetching = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.isFetching || false
);

const selectTargetGender = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.user.gender_filter
);

const selectGlobalErrors = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.globalErrors
);

const selectUserObject = () => createSelector(
  selectDashboard(),
  (dashboardState) => {
    if (!dashboardState) {
      return undefined;
    }
    return dashboardState.user;
  }
);

const selectUserID = () => createSelector(
  selectUserObject(),
  (substate) => substate._id
);

const selectDashboardHistory = () => createSelector(
  selectDashboard(),
  (dashboard) => dashboard.history
);

const selectMatchesHistory = () => createSelector(
  selectDashboard(),
  (dashboard) => dashboard.matches
);

const selectUserName = () => createSelector(
  selectUserObject(),
  (userObject) => {
    if (!userObject) return undefined;
    return userObject.name;
  }
);

export default selectDashboard;
export {
  selectDashboard,
  selectDashboardDomain,
  selectTargetGender,
  selectGlobalErrors,
  selectFetching,
  selectUserObject,
  selectUserID,
  selectDashboardHistory,
  selectMatchesHistory,
  selectUserName,
};
