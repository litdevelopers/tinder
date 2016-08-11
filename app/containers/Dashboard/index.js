/*
 *
 * Dashboard
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import styles from './styles.css';

import { selectAuthToken } from 'containers/Auth/selectors';
import { fetchTinderData } from './actions';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // check if token and userid exists or not
    this.props.fetchInitialData();
  }

  render() {
    return (
      <div className={styles.dashboard}>

      </div>
    );
  }
}

Dashboard.propTypes = {
  token: PropTypes.string,
  routeTo: PropTypes.func.isRequired,
  fetchInitialData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  token: selectAuthToken(),
});

function mapDispatchToProps(dispatch) {
  return {
    routeTo: (route) => dispatch(push(route)),
    fetchInitialData: () => dispatch(fetchTinderData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
