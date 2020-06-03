import React from 'react';
import PropTypes from 'prop-types';

import LoginForm from 'components/forms/LoginForm';
import ScreenLayout from 'components/layout/ScreenLayout';

import Styled from './styled';

const LoginScreen = ({ onSubmit }) => (
  <ScreenLayout title="Login">
    <Styled.Container>
      <Styled.Item>
        <Styled.Header>Login</Styled.Header>
        <LoginForm onSubmit={onSubmit} />
      </Styled.Item>
    </Styled.Container>
  </ScreenLayout>
);

LoginScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginScreen;
