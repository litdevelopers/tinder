/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { checkNotificationPermissions } from './actions';
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
  checkNotificationPermissions: PropTypes.func,
  authToken: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    checkNotificationPermissions: () => dispatch(checkNotificationPermissions()),
  };
}

const mapStateToProps = createStructuredSelector({
  authToken: selectAuthToken(),
});


export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
