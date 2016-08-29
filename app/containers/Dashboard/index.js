/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectIsSyncing } from './selectors';
import { fetchUpdates, rehydrateMatches, checkNotificationPermissions } from './actions';
import { selectAuthToken } from 'containers/Auth/selectors';
import { createStructuredSelector } from 'reselect';

import Notification from 'containers/Notification';
import styles from './styles.css';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    const { authToken } = this.props;

    if (!authToken) {
      localStorage.setItem('routeIntent', window.location.pathname);
      window.location.replace('/login');
    } else if (!this.props.isSyncing) {
      this.props.rehydrateMatches();
    }
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
  authToken: PropTypes.string,
  isSyncing: PropTypes.bool,
};

function mapDispatchToProps(dispatch) {
  return {
    startBackgroundSync: () => dispatch(fetchUpdates()),
    rehydrateMatches: () => dispatch(rehydrateMatches()),
    checkNotificationPermissions: () => dispatch(checkNotificationPermissions()),
  };
}

const mapStateToProps = createStructuredSelector({
  authToken: selectAuthToken(),
  isSyncing: selectIsSyncing(),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
