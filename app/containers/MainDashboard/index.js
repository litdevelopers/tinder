import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchTinderData } from 'containers/Dashboard/actions';

import Text from 'components/Text';
import styles from './styles.css';


export class MainDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // check if token and userid exists or not
    this.props.fetchInitialData();
  }

  render() {
    return (
      <div className={styles.mainDashboard}>
        <Text type="name">Main Dashboard</Text>
      </div>
    );
  }
}

MainDashboard.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    fetchInitialData: () => dispatch(fetchTinderData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainDashboard);
