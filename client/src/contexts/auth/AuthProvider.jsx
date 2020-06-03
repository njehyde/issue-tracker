import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { checkAuthenticatedAction } from 'actions/auth';

import AuthContext from './AuthContext';

const AuthProvider = ({ user, children, checkAuthenticated }) => {
  useEffect(() => {
    if (user) {
      checkAuthenticated();
    }
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  user: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node.isRequired,
  checkAuthenticated: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.authStore.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkAuthenticated: checkAuthenticatedAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(AuthProvider);
