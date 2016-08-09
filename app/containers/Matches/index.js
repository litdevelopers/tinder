import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { detailPerson, superLikePerson, likePerson, passPerson } from './actions';
import { selectMatches, selectCurrentMatch, selectCurrentMatchLinks } from './selectors';
import styles from './styles.css';

import DetailView from 'components/DetailView';
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
          <DetailView
            data={this.props.matchDetail}
            imageData={this.props.matchDetailImages}
            onClickButton={this.props.onClickButton}
          />
        </div>
      </div>
    );
  }
}

DashboardMatches.PropTypes = {
  matches: PropTypes.object.isRequired,
  matchDetail: PropTypes.oneOfType([
    PropTypes.obj,
    PropTypes.node,
  ]),
  onClickCard: PropTypes.func.isRequired,
  onClickButton: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  matches: selectMatches(),
  matchDetail: selectCurrentMatch(),
  matchDetailImages: selectCurrentMatchLinks(),
});

function mapDispatchToProps(dispatch) {
  return {
    onClickCard: (id, image) => {
      dispatch(detailPerson(id, image));
    },
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

export default connect(mapStateToProps, mapDispatchToProps)(DragDropContext(HTML5Backend)(DashboardMatches));
