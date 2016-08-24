/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUpdates, rehydrateMatches, checkNotificationPermissions } from './actions';

import Notification from 'containers/Notification';
import styles from './styles.css';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.rehydrateMatches();
  }

  componentDidMount() {
    this.props.checkNotificationPermissions();
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
  checkNotificationPermissions: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    startBackgroundSync: () => dispatch(fetchUpdates()),
    rehydrateMatches: () => dispatch(rehydrateMatches()),
    checkNotificationPermissions: () => dispatch(checkNotificationPermissions()),
  };
}


export default connect(null, mapDispatchToProps)(Dashboard);
