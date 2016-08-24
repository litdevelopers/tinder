import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { changeLogin, changePassword, loginFacebook, loginLocal, loginChrome } from './actions';
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

  componentDidMount() {
    const { token } = this.props.route.params;
    if (token) {
      this.props.loginChrome(token);
    } else {
      chrome.runtime.sendMessage('pnjomljokngeigoagoghbhfeklgecjnl', {type: "doAuth"}, function(response) {
            console.log(response);
      });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.onLogin}>
          <input type="text" value={this.props.login} placeholder="facebook login" onChange={this.props.onChangeLogin} />
          <input type="password" value={this.props.password} placeholder="facebook password" onChange={this.props.onChangePassword} />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

Auth.propTypes = {
  onChangeLogin: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  loginLocal: PropTypes.func.isRequired,
  routeToDashboard: PropTypes.func.isRequired,
  login: PropTypes.string,
  password: PropTypes.string,
  token: PropTypes.string,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onChangeLogin: (event) => dispatch(changeLogin(event.target.value)),
    onChangePassword: (event) => dispatch(changePassword(event.target.value)),
    loginLocal: () => dispatch(loginLocal()),
    onLogin: (e) => {
      e.preventDefault();
      dispatch(loginFacebook());
    },
    loginChrome: (token) => dispatch(loginChrome(token)),
    routeToDashboard: () => dispatch(push('/dashboard')),
  };
}

const mapStateToProps = (state, ownProps) => ({
  route: ownProps,
  ...createStructuredSelector({
  login: selectLogin(),
  password: selectPassword(),
  token: selectAuthToken(),
})});


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
