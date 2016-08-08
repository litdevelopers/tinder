import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { detailPerson } from './actions';
import { selectMatches } from './selectors';
import styles from './styles.css';

import MatchCard from 'components/MatchCard';


class DashboardMatches extends React.Component { // eslint-disable-line
  mapMatches() {
    return this.props.matches.map((each) => <MatchCard key={each._id} data={each} onClick={this.props.onClickCard} />);
  }

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

function mapDispatchToProps(dispatch) {
  return {
    onClickCard: (id) => dispatch(detailPerson(id)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMatches);
