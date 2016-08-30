import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { changeLogin, changePassword, loginFacebook, loginLocal } from './actions';
import { createStructuredSelector } from 'reselect';

import {
  selectPassword,
  selectLogin,
  selectAuthToken,
} from './selectors';

class Auth extends React.Component {

  componentWillMount() {
    if (this.props.token) {
      this.props.routeToDashboard();
    }
    this.props.loginLocal();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

Auth.propTypes = {
  onLogin: PropTypes.func.isRequired,
  loginLocal: PropTypes.func.isRequired,
  routeToDashboard: PropTypes.func.isRequired,
  token: PropTypes.string,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    loginLocal: () => dispatch(loginLocal()),
    onLogin: (e) => {
      e.preventDefault();
      dispatch(loginFacebook());
    },
    routeToDashboard: () => dispatch(push('/dashboard')),
  };
}

const mapStateToProps = createStructuredSelector({
  token: selectAuthToken(),
});


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
