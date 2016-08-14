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
  (substate) => substate.toJS()
);

const selectFetching = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.isFetching || false
);

const selectTargetGender = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.user.user.gender_filter || 1
);

const selectGlobalErrors = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.globalErrors
);

const selectUserObject = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.user.user || null
);

const selectDashboardHistory = () => createSelector(
    selectDashboard(),
    (dashboard) => dashboard.history
);


export default selectDashboard;
export {
  selectDashboard,
  selectDashboardDomain,
  selectTargetGender,
  selectGlobalErrors,
  selectFetching,
  selectUserObject,
  selectDashboardHistory,
};
