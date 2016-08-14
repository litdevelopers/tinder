import { createSelector } from 'reselect';
import { selectDashboard } from 'containers/Dashboard/selectors';
import { mergeArray } from 'utils/operations';

const selectRecommendationsDomain = () => state => state.get('recommendations');
const selectRecommendations = () => createSelector(
  selectRecommendationsDomain(),
  (substate) => substate.toJS()
);

const selectMatches = () => createSelector(
    selectDashboard(),
    (dashboardState) => dashboardState.recommendations
);

const selectCurrentMatch = () => createSelector(
  selectRecommendations(),
  selectMatches(),
  (recommendationsState, matches) => {
    if (!matches) return undefined; // eslint-disable-line
    return matches.filter((each) => each._id === recommendationsState.currentDetailView.id)[0];
  }
);

const selectCurrentMatchLinks = () => createSelector(
  selectCurrentMatch(),
  (currentMatchState) => {
    if (!currentMatchState || currentMatchState === '') {
      return undefined;
    }
    const tinderImages = currentMatchState.photos.map((each) => each.url);
    const instagramImages = (currentMatchState.instagram && currentMatchState.instagram.photos) ? currentMatchState.instagram.photos.map((each) => each.image) : [];
    return mergeArray(tinderImages, instagramImages, 20, (each) => { return { original: each }; });
  }
);

export {
  selectRecommendationsDomain,
  selectMatches,
  selectCurrentMatch,
  selectCurrentMatchLinks,
};
