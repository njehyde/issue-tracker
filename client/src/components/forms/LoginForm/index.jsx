import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withValidation from 'hocs/withValidation';
import { Text } from 'components/styled';

import LoginForm from './LoginForm';
import validationSchema from './validation';

class LoginFormContainer extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    generateRefs: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: '',
        password: '',
      },
      isValidationEnabled: false,
      didLoginFail: false,
    };
  }

  componentDidMount() {
    const { generateRefs } = this.props;
    generateRefs(Object.keys(validationSchema.fields));
  }

  handleChange = (key, value) => {
    const { validate } = this.props;
    const { isValidationEnabled } = this.state;

    this.setState(prevState => {
      const formData = {
        ...prevState.formData,
        [key]: value,
      };

      if (isValidationEnabled) {
        validate(formData, validationSchema);
      }

      return {
        formData,
      };
    });
  };

  handleFailedLogin = () => {
    this.setState({ didLoginFail: true });
  };

  handleSubmit = () => {
    const { onSubmit, validate } = this.props;
    const { formData, isValidationEnabled } = this.state;

    if (!isValidationEnabled) {
      this.setState({ isValidationEnabled: true });
    }

    const isValid = validate(formData, validationSchema, true);

    if (isValid) {
      const { email, password } = formData;
      onSubmit(email, password, this.handleFailedLogin);
    }
  };

  render() {
    const { errors, formRefs } = this.props;
    const { formData, didLoginFail } = this.state;
    return (
      <>
        {didLoginFail && (
          <Text.Error>Email or password did not match a valid user.</Text.Error>
        )}
        <LoginForm
          formData={formData}
          errors={errors}
          formRefs={formRefs}
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
        />
      </>
    );
  }
}

export default withValidation(LoginFormContainer);
