/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchUpdates } from './actions';

import Notification from 'containers/Notification';
import styles from './styles.css';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    this.props.startBackgroundSync();
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
};

function mapDispatchToProps(dispatch) {
  return {
    startBackgroundSync: () => dispatch(fetchUpdates()),
  };
}


export default connect(null, mapDispatchToProps)(Dashboard);
