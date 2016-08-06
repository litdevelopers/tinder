/*
 *
 * Dashboard
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import styles from './styles.css';

import { fetchTinderData } from './actions';
import { selectToken, selectId } from 'containers/Auth/selectors';

export class Dashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // check if token and userid exists or not
    if (!this.props.token || !this.props.id){
      this.props.routeTo('/login');
    } else {
      this.props.fetchInitialData();
    }
  }


  render() {
    return (
      <div className={styles.dashboard}>

      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectToken(),
  id: selectId(),
});

function mapDispatchToProps(dispatch) {
  return {
    routeTo: (route) => dispatch(push(route)),
    fetchInitialData: () => dispatch(fetchTinderData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
