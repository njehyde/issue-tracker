import React from 'react';
import PropTypes from 'prop-types';

import AddUserForm from 'components/forms/AddUserForm';
import ScreenLayout from 'components/layout/ScreenLayout';

import Styled from './styled';

const AddUserScreen = ({ onSubmit }) => (
  <ScreenLayout title="Register">
    <Styled.Container>
      <Styled.Item>
        <Styled.Header>Register</Styled.Header>
        <AddUserForm onSubmit={onSubmit} />
      </Styled.Item>
    </Styled.Container>
  </ScreenLayout>
);

AddUserScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default AddUserScreen;
