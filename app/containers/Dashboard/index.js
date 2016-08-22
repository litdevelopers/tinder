/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUpdates, rehydrateMatches } from './actions';

import Notification from 'containers/Notification';
import styles from './styles.css';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.rehydrateMatches();
    this.props.startBackgroundSync();
  }

  componentWillUnmount() {
    // console.log('Dashboard Unmounting, storing last activity date');
  }

  render() {
    return (
      <div className={styles.dashboard}>
        <Notification />
        {this.props.children}
      </div>
    );
  }
}

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
  startBackgroundSync: PropTypes.func.isRequired,
  rehydrateMatches: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    startBackgroundSync: () => dispatch(fetchUpdates()),
    rehydrateMatches: () => dispatch(rehydrateMatches()),
  };
}


export default connect(null, mapDispatchToProps)(Dashboard);
