import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { sortMatches, fetchData } from 'containers/Dashboard/actions';
import { detailPerson, superLikePerson, likePerson, passPerson } from './actions';

import { selectMatches, selectCurrentMatch, selectCurrentMatchLinks } from './selectors';
import { selectTargetGender, selectFetching } from 'containers/Dashboard/selectors';


import DetailView from 'components/DetailView';
import MatchCard from 'components/MatchCard';
import Panel from 'components/Panel';
import Infinite from 'react-infinite';

import styles from './styles.css';


class DashboardRecommendations extends React.Component { // eslint-disable-line
  componentWillMount() {
    if (!this.props.matches) this.props.fetchMatches();
  }

  mapMatches() {
    return this.props.matches && this.props.matches.map((each) => <MatchCard key={each._id} data={each} onClick={this.props.onClickCard} onClickButton={this.props.onClickButton} />);
  }

  handleFetch() {
    if (!this.props.isFetching) this.props.fetchMatches();
  }

  render() {
    const matches = (this.props && this.props.matches) ? this.mapMatches() : null;
    return (
      <div className={styles.dashboardMatchesContainer}>
        <div className={styles.dashboardMatchesCards}>
          <div className={styles.dashboardMatchesNavigation}>
            <select
              onChange={(event) => {
                this.props.onFilter(event.target.value);
              }}
            >
              <option value="normal">Sort By...</option>
              <option value="lastActive">Recently Active</option>
              <option value="distance">Nearby</option>
              <option value="youngest">Youngest</option>
              <option value="oldest">Oldest</option>
            </select>
            <div className={styles.dashboardMatchesContainerButtons}>
            {
              // <Button type="fetchMatches" onClick={() => this.props.onMultiple(this.props.matches, 'like')}>Like All</Button>
              // <Button type="fetchMatches" onClick={() => this.props.onMultiple(this.props.matches, 'pass')}>Pass All</Button>
            }
            </div>
          </div>
          {matches ?
            <Infinite
              className={styles.dashboardMatchesCardsContainer}
              onInfiniteLoad={() => this.handleFetch()}
              containerHeight={1200}
              elementHeight={350}
              infiniteLoadBeginEdgeOffset={200}
              itemsPerRow={3}
              isInfiniteLoading={this.props.isFetching}
            >
              {matches}
            </Infinite> : <div className={styles.dashboardMatchesCardsContainer} /> }
        </div>
        <div className={styles.dashboardMatchesDetails}>
        {this.props.matchDetail && this.props.matchDetailImages ?
          <DetailView
            data={this.props.matchDetail}
            imageData={this.props.matchDetailImages}
            onClickButton={this.props.onClickButton}
            targetGender={this.props.targetGender}
          /> : <Panel type="matchDetailPlaceholder" targetGender={this.props.targetGender} hasMatches={!!this.props.matches} />}
        </div>
      </div>
    );
  }
}

DashboardRecommendations.propTypes = {
  matches: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  matchDetail: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
  ]),
  matchDetailImages: PropTypes.array,
  onClickCard: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired,
  onMultiple: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  fetchMatches: PropTypes.func.isRequired,
  targetGender: PropTypes.number.isRequired,
  isFetching: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  matches: selectMatches(),
  matchDetail: selectCurrentMatch(),
  matchDetailImages: selectCurrentMatchLinks(),
  targetGender: selectTargetGender(),
  isFetching: selectFetching(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchMatches: () => dispatch(fetchData('RECOMMENDATIONS_DATA')),
    onFilter: (sortType) => dispatch(sortMatches(sortType)),
    onMultiple: (matches, type) => {
      const currentMatches = matches;
      currentMatches.map((each) => {
        if (type === 'like') return dispatch(likePerson(each._id, each.content_hash));
        if (type === 'pass') return dispatch(passPerson(each._id, each.content_hash));
        return null;
      });
    },
    onClickCard: (id, image) => {
      dispatch(detailPerson(id, image));
    },
    onClickButton: (id, hash, type) => {
      if (type === 'like') dispatch(likePerson(id, hash));
      if (type === 'pass') dispatch(passPerson(id, hash));
      if (type === 'superlike') dispatch(superLikePerson(id, hash));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRecommendations);
