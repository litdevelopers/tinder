import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { detailPerson, superLikePerson, likePerson, passPerson } from './actions';
import { selectMatches } from './selectors';
import styles from './styles.css';

import MatchCard from 'components/MatchCard';


class DashboardMatches extends React.Component { // eslint-disable-line
  mapMatches() {
    return this.props.matches.map((each) => <MatchCard key={each._id} data={each} onClick={this.props.onClickCard} onClickButton={this.props.onClickButton} />);
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
    onClickButton: (id, type) => {
      if (type === 'like') {
        dispatch(likePerson(id));
      } else if (type === 'pass') {
        dispatch(passPerson(id));
      } else if (type === 'superlike') {
        dispatch(superLikePerson(id));
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMatches);
