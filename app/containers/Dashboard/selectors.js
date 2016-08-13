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
  selectDashboardDomain(),
  (dashboardState) => dashboardState.isFetching
);

const selectTargetGender = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.user.user.gender_filter
);

const selectGlobalErrors = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.globalErrors
);

export default selectDashboard;
export {
  selectDashboard,
  selectDashboardDomain,
  selectTargetGender,
  selectGlobalErrors,
  selectFetching,
};
