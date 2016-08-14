import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Motion, spring } from 'react-motion';

import { fetchTinderData } from 'containers/Dashboard/actions';
import { selectUserObject } from 'containers/Dashboard/selectors';
import { getAge } from 'utils/operations';

import Text from 'components/Text';
import styles from './styles.css';


export class MainDashboard extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    // check if token and userid exists or not
    this.props.fetchInitialData();
  }

  render() {
    const { userObject } = this.props;
    if (userObject) {
      const { schools, bio } = userObject;

      return (
        <div className={styles.mainDashboard}>
          <div className={styles.mainDashboardProfile}>
            <div className={styles.mainDashboardHeader}>
            </div>
            <Motion
              defaultStyle={{
                flex: 0,
                width: 50,
                minHeight: 50,
              }}
              style={{
                flex: spring(4, [300, 26]),
                width: 150,
                minHeight: 150,
              }}
            >
              {({ flex, width, minHeight }) =>
                <div className={styles.mainDashboardContent} style={{ flex }}>
                  <div className={styles.mainDashboardProfilePicture} style={{ backgroundImage: `url(${userObject.photos[0].url}`, width, minHeight }} />
                  <div className={styles.mainDashboardContentContainer}>
                    <div className={styles.profileNameContainer}>
                      <Text type="profileName">{userObject.full_name}</Text>
                    </div>
                    <div className={styles.mainDashboardContentContainerTeaser}>
                      <Text type="bio">{getAge(userObject.birth_date)}</Text>
                      <Text type="bio">{userObject.gender === 0 ? 'Male' : 'Female'}</Text>
                      <Text type="bio">{schools[0] && schools[0].name}</Text>
                    </div>
                    <div className={styles.bioContainer}>
                      <label htmlFor="bioInput" className={styles.bioInputLabel}>About {userObject.name} <Text type="bioInputTextCount">{500 - bio.length}</Text></label>
                      <textarea value={bio} className={styles.bioInput} id="bioInput" />
                    </div>
                  </div>
                </div>
              }
            </Motion>
          </div>
          <div className={styles.mainDashboardSettings}>
          </div>
        </div>);
    }
    return null;
  }
}

MainDashboard.propTypes = {
  fetchInitialData: PropTypes.func.isRequired,
  userObject: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  userObject: selectUserObject(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchInitialData: () => dispatch(fetchTinderData()),
  };
}




export default connect(mapStateToProps, mapDispatchToProps)(MainDashboard);
