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

export default selectDashboard;
export {
  selectDashboardDomain,
};
