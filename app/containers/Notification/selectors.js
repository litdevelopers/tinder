import { createSelector } from 'reselect';
import { selectDashboard } from 'containers/Dashboard/selectors';


const selectCurrentError = () => createSelector(
  selectDashboard(),
  (dashboardState) => dashboardState.currentError
);

export default selectCurrentError;
