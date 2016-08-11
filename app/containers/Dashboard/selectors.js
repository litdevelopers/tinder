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


const selectTargetGender = createSelector(
  selectDashboard(),
  (dashboardState) => {
    console.log(dashboardState);
    return dashboardState.user.user.gender_filter;
  },
);

export default selectDashboard;
export {
  selectDashboardDomain,
  selectTargetGender,
};
