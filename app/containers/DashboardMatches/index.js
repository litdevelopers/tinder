import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectMatches } from './selectors';

import styles from './styles.css';

import MatchCard from 'components/MatchCard';


class DashboardMatches extends React.Component { // eslint-disable-line
  mapMatches() { return this.props.matches.results.map((each) => <MatchCard key={each._id} data={each} />); }

  render() {
    const matches = (this.props && this.props.matches !== '') ? this.mapMatches() : null;
    return (
      <div className={styles.dashboardMatchesContainer}>
        <div className={styles.dashboardMatchesCards}>
            {matches}
        </div>

        <div className={styles.dashboardMatchesDetails}>
        </div>
      </div>
    );
  }
}

DashboardMatches.PropTypes = {
  matches: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  matches: selectMatches(),
});

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMatches);
