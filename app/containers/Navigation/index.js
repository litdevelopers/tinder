import React, { PropTypes } from 'react';
import styles from './styles.css';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectNewNotifications } from 'containers/Messages/selectors';
import { selectUserName } from 'containers/Dashboard/selectors';
import { selectAuthToken } from 'containers/Auth/selectors';

import { push } from 'react-router-redux';


class Navigation extends React.Component { // eslint-disable-line
  render() {
    return (this.props.isLoggedIn ?
      <div className={styles.navigation}>
        <span onClick={this.props.navigateTo} id="/dashboard/home" className={window.location.pathname === '/dashboard/home' ? styles.navigation_item_active : styles.navigation_item}>{this.props.userName || 'Dashboard'}</span>
        <span onClick={this.props.navigateTo} id="/dashboard/recommendations" className={window.location.pathname === '/dashboard/recommendations' ? styles.navigation_item_active : styles.navigation_item}>Recommendations</span>
        <span onClick={this.props.navigateTo} id="/dashboard/messages" className={window.location.pathname === '/dashboard/messages' ? styles.navigation_item_active : styles.navigation_item}>Matches{this.props.notifications && this.props.notifications.length ? <div className={styles.newDot} /> : null}</span>
      </div> : <div className={styles.navigation} />
    );
  }
}

Navigation.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  userName: PropTypes.string,
  isLoggedIn: PropTypes.string,
};

function mapDispatchToProps(dispatch) {
  return {
    navigateTo: (event) => {
      if (window.location.pathname !== event.target.id) {
        dispatch(push(event.target.id));
      }
    },
  };
}

const mapStateToProps = createStructuredSelector({
  notifications: selectNewNotifications(),
  userName: selectUserName(),
  isLoggedIn: selectAuthToken(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
