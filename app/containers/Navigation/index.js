import React, { PropTypes } from 'react';
import styles from './styles.css';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { locationSelector } from './selectors';
import { selectNewNotifications } from 'containers/Messages/selectors';

import { push } from 'react-router-redux';


class Navigation extends React.Component { // eslint-disable-line
  render() {
    return (
      <div className={styles.navigation}>
        <p onClick={this.props.navigateTo} id="/dashboard/home" className={window.location.pathname === '/dashboard/home' ? styles.navigation_item_active : styles.navigation_item}>Dashboard</p>
        <p onClick={this.props.navigateTo} id="/dashboard/recommendations" className={window.location.pathname === '/dashboard/recommendations' ? styles.navigation_item_active : styles.navigation_item}>Recommendations</p>
        <p onClick={this.props.navigateTo} id="/dashboard/messages" className={window.location.pathname === '/dashboard/messages' ? styles.navigation_item_active : styles.navigation_item}>Matches{this.props.notifications && this.props.notifications.length ? <div className={styles.newDot} /> : null}</p>
      </div>
    );
  }
}

Navigation.propTypes = {
  navigateTo: PropTypes.func.isRequired,
  notifications: PropTypes.array,
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
  location: locationSelector(),
  notifications: selectNewNotifications(),
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
