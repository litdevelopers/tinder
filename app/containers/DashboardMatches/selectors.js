import { createSelector } from 'reselect';
import { selectDashboardDomain } from 'containers/Dashboard/selectors';

const selectMatches = () => createSelector(
    selectDashboardDomain(),
    (dashboardState) => dashboardState.get('matches')
);

export {
  selectMatches,
};
