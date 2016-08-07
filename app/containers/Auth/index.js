import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { changeLogin, changePassword, loginFacebook } from './actions';
import { createStructuredSelector } from 'reselect';

import {
  selectPassword,
  selectLogin,
  selectId,
  selectToken,
} from './selectors';

class Auth extends React.Component {

  componentWillMount() {
    if (this.props.token && this.props.id) {
      this.props.routeToDashboard();
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

Auth.PropTypes = {
  onChangeLogin: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  routeToDashboard: PropTypes.func.isRequired,
  login: PropTypes.string,
  password: PropTypes.string,
  token: PropTypes.string,
  id: PropTypes.string,
};



function mapDispatchToProps(dispatch) {
  return {
    onChangeLogin: (event) => dispatch(changeLogin(event.target.value)),
    onChangePassword: (event) => dispatch(changePassword(event.target.value)),
    onLogin: (e) => {
      e.preventDefault();
      dispatch(loginFacebook());
    },
    routeToDashboard: () => dispatch(push('/dashboard')),
  };
}

const mapStateToProps = createStructuredSelector({
  login: selectLogin(),
  password: selectPassword(),
  token: selectToken(),
  id: selectId(),
});


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
