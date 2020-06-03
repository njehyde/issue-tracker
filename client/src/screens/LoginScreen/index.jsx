import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loginAction } from 'actions/auth';
import LoginScreen from './LoginScreen';

class LoginScreenContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired,
  };

  handleSubmit = (email, password, onFail) => {
    const { login } = this.props;
    login(email, password, onFail);
  };

  render() {
    return <LoginScreen onSubmit={this.handleSubmit} />;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login: loginAction,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(LoginScreenContainer);
