import React from 'react';
import PropTypes from 'prop-types';

import AuthContext from './AuthContext';

const AuthConsumer = props => (
  <AuthContext.Consumer>
    {context => props.children(context.client)}
  </AuthContext.Consumer>
);

AuthConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AuthConsumer;
