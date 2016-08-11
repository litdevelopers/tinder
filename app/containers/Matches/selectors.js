import { createSelector } from 'reselect';
import { selectDashboardDomain } from 'containers/Dashboard/selectors';
import { mergeArray } from 'utils/operations';

const selectMatchesDomain = () => state => state.get('matches');


const selectMatches = () => createSelector(
    selectDashboardDomain(),
    (dashboardState) => dashboardState.get('matches')
);

const selectCurrentMatch = () => createSelector(
  selectMatchesDomain(),
  selectMatches(),
  (matchesState, matches) => matches.filter((each) => each._id === matchesState.getIn(['currentDetailView', 'id']))[0]
);

const selectCurrentMatchLinks = () => createSelector(
  selectCurrentMatch(),
  (currentMatchState) => {
    if (!currentMatchState) {
      return undefined;
    }
    const tinderImages = currentMatchState.photos.map((each) => each.url);
    const instagramImages = (currentMatchState.instagram && currentMatchState.instagram.photos) ? currentMatchState.instagram.photos.map((each) => each.image) : [];
    return mergeArray(tinderImages, instagramImages, 20, (each) => { return { original: each }; });
  }
);

export {
  selectMatchesDomain,
  selectMatches,
  selectCurrentMatch,
  selectCurrentMatchLinks,
};
