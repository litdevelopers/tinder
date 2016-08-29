/* eslint no-underscore-dangle: 1 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { detailPerson, superLikePerson, likePerson, passPerson, fetchRecommendations, sortRecommendations, dumpAllRecommendationsStart, fetchRecommendationsLocally } from './actions';

import { selectRecommendationsList, selectCurrentRecommendation, selectCurrentRecommendationsLinks, selectIsFetching, selectPotentialMatchList } from './selectors';
import { selectTargetGender } from 'containers/Dashboard/selectors';


import DetailView from 'components/DetailView';
import MatchCard from 'components/MatchCard';
import Panel from 'components/Panel';
import Button from 'components/Button';
import Infinite from 'react-infinite';

import styles from './styles.css';


class DashboardRecommendations extends React.Component { // eslint-disable-line
  constructor() {
    super();
    this.changeFilter = this.changeFilter.bind(this);
  }

  componentWillMount() {
    this.props.fetchRecommendationsLocally();
  }

  componentWillUnmount() {
    this.props.dumpAllRecommendations();
  }

  mapRecommendations() {
    return this.props.recommendations.map((each) => {
      if (this.props.potentialMatches.includes(each._id)) {
        return <MatchCard type="active" key={each._id} data={each} onClick={this.props.onClickCard} onClickButton={this.props.onClickButton} />;
      }
      return <MatchCard key={each._id} data={each} onClick={this.props.onClickCard} onClickButton={this.props.onClickButton} />;
    }
    );
  }

  handleFetch() {
    if (!this.props.isFetching) this.props.fetchRecommendations();
  }

  changeFilter(event) {
    this.props.onFilter(event.target.value);
  }

  render() {
    const recommendations = (this.props && this.props.recommendations) ? this.mapRecommendations() : null;
    return (
      <div className={styles.dashboardMatchesContainer}>
        <div className={styles.dashboardMatchesCards}>
          <div className={styles.dashboardMatchesNavigation}>
            <select
              onChange={this.changeFilter}
            >
              <option value="normal">Sort By...</option>
              <option value="lastActive">Recently Active</option>
              <option value="distance">Nearby</option>
              <option value="youngest">Youngest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className={styles.dashboardMatchesContainerButtons}>
              <Button type="fetchMatches" onClick={() => this.props.onMultiple(this.props.recommendations, 'like')}>Like All</Button>
              <Button type="fetchMatches" onClick={() => this.props.onMultiple(this.props.recommendations, 'pass')}>Pass All</Button>
            </div>
          </div>
          {recommendations ?
            <Infinite
              className={styles.dashboardMatchesCardsContainer}
              onInfiniteLoad={() => this.handleFetch()}
              containerHeight={1200}
              elementHeight={350}
              infiniteLoadBeginEdgeOffset={200}
              itemsPerRow={3}
              isInfiniteLoading={this.props.isFetching}
            >
              {recommendations}
            </Infinite> : <div className={styles.dashboardMatchesCardsContainer} /> }
        </div>
        <div className={styles.dashboardMatchesDetails}>
        {this.props.recommendationDetail && this.props.recommendationImages ?
          <DetailView
            data={this.props.recommendationDetail}
            imageData={this.props.recommendationImages}
            onClickButton={this.props.onClickButton}
            targetGender={this.props.targetGender}
            isPotentialLike={this.props.potentialMatches.includes(this.props.recommendationDetail._id)}
            onClickAction={this.props.onClickButton}
            recommendationView
          /> :
          <Panel
            type="matchDetailPlaceholder"
            targetGender={this.props.targetGender}
            hasMatches={!!this.props.recommendations}
            isFetching={this.props.isFetching}
          />}
        </div>
      </div>
    );
  }
}

DashboardRecommendations.propTypes = {
  recommendations: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  recommendationDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
  ]),
  recommendationImages: PropTypes.array,
  onClickCard: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired,
  onMultiple: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  fetchRecommendations: PropTypes.func.isRequired,
  targetGender: PropTypes.number,
  isFetching: PropTypes.bool,
  dumpAllRecommendations: PropTypes.func,
  fetchRecommendationsLocally: PropTypes.func,
  potentialMatches: PropTypes.array,
};

const mapStateToProps = createStructuredSelector({
  recommendations: selectRecommendationsList(),
  recommendationDetail: selectCurrentRecommendation(),
  recommendationImages: selectCurrentRecommendationsLinks(),
  potentialMatches: selectPotentialMatchList(),
  targetGender: selectTargetGender(),
  isFetching: selectIsFetching(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchRecommendationsLocally: () => dispatch(fetchRecommendationsLocally()),
    fetchRecommendations: () => dispatch(fetchRecommendations()),
    onFilter: (sortType) => dispatch(sortRecommendations(sortType)),
    onMultiple: (recommendations, type) => {
      const currentRecommendations = recommendations;
      currentRecommendations.map((each) => {
        if (type === 'like') return dispatch(likePerson(each._id, each.content_hash));
        if (type === 'pass') return dispatch(passPerson(each._id, each.content_hash));
        return null;
      });
    },
    onClickCard: (id, image) => {
      dispatch(detailPerson(id, image));
    },
    onClickButton: (id, hash, details, type) => {
      if (type === 'like') dispatch(likePerson(id, hash, details));
      if (type === 'pass') dispatch(passPerson(id, hash, details));
      if (type === 'superlike') dispatch(superLikePerson(id, hash, details));
    },
    dumpAllRecommendations: () => dispatch(dumpAllRecommendationsStart()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRecommendations);
