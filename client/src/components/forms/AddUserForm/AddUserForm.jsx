import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import TextField from 'components/core/TextField';
import { Button } from 'components/styled';

const AddUserForm = ({ formData, formRefs, errors, onChange, onSubmit }) => {
  useEffect(() => {
    if (formRefs?.firstName?.current) {
      formRefs.firstName.current.focus();
    }
  }, [formRefs?.firstName?.current]);

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Flex width={1} mb={2}>
        <Box width={1}>
          <TextField
            ref={formRefs.firstName}
            name="firstName"
            type="text"
            label="First name"
            placeholder="Enter first name"
            value={formData.firstName}
            required
            error={errors.firstName}
            onChange={event => onChange('firstName', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={3}>
        <Box width={1}>
          <TextField
            ref={formRefs.lastName}
            name="lastName"
            type="text"
            label="Last name"
            placeholder="Enter last name"
            value={formData.lastName}
            required
            error={errors.lastName}
            onChange={event => onChange('lastName', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={3}>
        <Box width={1}>
          <TextField
            ref={formRefs.email}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email"
            value={formData.email}
            required
            error={errors.email}
            onChange={event => onChange('email', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={2}>
        <Box width={1}>
          <TextField
            ref={formRefs.password}
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            value={formData.password}
            required
            error={errors.password}
            onChange={event => onChange('password', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex width={1} mb={3}>
        <Box width={1}>
          <TextField
            ref={formRefs.confirmPassword}
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Enter password"
            value={formData.confirmPassword}
            required
            error={errors.confirmPassword}
            onChange={event => onChange('confirmPassword', event.target.value)}
          />
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Button type="submit" primary invert>
          Register
        </Button>
      </Flex>
    </form>
  );
};

AddUserForm.propTypes = {
  errors: PropTypes.objectOf(PropTypes.any).isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddUserForm;
