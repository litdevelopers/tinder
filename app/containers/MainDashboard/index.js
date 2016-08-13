import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Motion, spring } from 'react-motion';

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
        <div className={styles.mainDashboardHeader}>

        </div>
        <Motion
          defaultStyle={{
            flex: 0,
          }}
          style={{
            flex: spring(4, [300, 26]),
          }}
        >
        {style =>
          <div className={styles.mainDashboardContent} style={style}>
            {style.flex === 4 ? <p>Hello</p> : <p>No</p>}
          </div>
        }
        </Motion>
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
