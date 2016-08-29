/* eslint no-underscore-dangle: 1 */

import { createSelector } from 'reselect';
import { selectDashboard } from 'containers/Dashboard/selectors';
import { mergeArray } from 'utils/operations';

const selectRecommendationsDomain = () => state => state.get('recommendations');
const selectRecommendations = () => createSelector(
  selectRecommendationsDomain(),
  (substate) => substate.toJS()
);

const selectRecommendationsList = () => createSelector(
    selectRecommendations(),
    (dashboardState) => dashboardState.recommendations
);

const selectPotentialMatchList = () => createSelector(
    selectRecommendations(),
    (dashboardState) => {
      const matches = Array.from(dashboardState.sortLikes).map((each) => each._id);
      return matches;
    }
);

const selectLimitedRecommendationsList = () => createSelector(
  selectRecommendations(),
  (substate) => {
    if (substate.recommendations) {
      return substate.recommendations.slice(0, 20);
    }
    return null;
  }
);

const selectCurrentRecommendation = () => createSelector(
  selectRecommendations(),
  selectRecommendationsList(),
  (recommendationsState, matches) => {
    if (!matches) return undefined;
    return matches.filter((each) => each._id === recommendationsState.currentDetailView.id)[0];
  }
);

const selectCurrentRecommendationsLinks = () => createSelector(
  selectCurrentRecommendation(),
  (currentMatchState) => {
    if (!currentMatchState || currentMatchState === '') {
      return undefined;
    }
    const tinderImages = currentMatchState.photos.map((each) => each.url);
    const instagramImages = (currentMatchState.instagram && currentMatchState.instagram.photos) ? currentMatchState.instagram.photos.map((each) => each.image) : [];
    return mergeArray(tinderImages, instagramImages, 20, (each) => { return { original: each }; });
  }
);

const selectIsFetching = () => createSelector(
  selectRecommendations(),
  (substate) => substate.isFetching
);

const selectShouldUpdate = () => createSelector(
  selectDashboard(),
  (substate) => substate.shouldUpdateRecommendations
);

export {
  selectRecommendationsDomain,
  selectRecommendationsList,
  selectLimitedRecommendationsList,
  selectCurrentRecommendation,
  selectCurrentRecommendationsLinks,
  selectIsFetching,
  selectShouldUpdate,
  selectPotentialMatchList,
};
