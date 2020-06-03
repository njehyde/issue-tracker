import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withValidation from 'hocs/withValidation';
import { addUserTransform } from 'transforms/auth';

import AddUserForm from './AddUserForm';
import validationSchema from './validation';

class AddUserFormContainer extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    asyncValidate: PropTypes.func.isRequired,
    generateRefs: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      isValidationEnabled: false,
    };
  }

  componentDidMount() {
    const { generateRefs } = this.props;
    generateRefs(Object.keys(validationSchema.fields));
  }

  handleChange = async (key, value) => {
    const { asyncValidate, errors } = this.props;
    const { isValidationEnabled, formData } = this.state;

    const updatedFormData = {
      ...formData,
      [key]: value,
    };

    if (isValidationEnabled) {
      const skipEmailAsyncCheck = key !== 'email';
      const isEmailValid = !errors.email;
      await asyncValidate(updatedFormData, validationSchema, false, null, {
        skipEmailAsyncCheck,
        isEmailValid,
      });
    }

    this.setState({ formData: updatedFormData });
  };

  handleSubmit = async () => {
    const { onSubmit, asyncValidate } = this.props;
    const { formData, isValidationEnabled } = this.state;

    if (!isValidationEnabled) {
      this.setState({ isValidationEnabled: true });
    }

    const isValid = await asyncValidate(formData, validationSchema, false);

    if (isValid) {
      const user = addUserTransform(formData);
      onSubmit(user);
    }
  };

  render() {
    const { errors, formRefs } = this.props;
    const { formData } = this.state;
    return (
      <AddUserForm
        formData={formData}
        errors={errors}
        formRefs={formRefs}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default withValidation(AddUserFormContainer);
