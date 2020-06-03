import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import withValidation from 'hocs/withValidation';
import { startSprintTransform } from 'transforms/project';

import StartSprintForm from './StartSprintForm';
import validationSchema from './validation';

class StartSprintFormContainer extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    sprint: PropTypes.objectOf(PropTypes.any).isRequired,
    generateRefs: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { sprint } = props;

    const duration = 1;
    const now = moment();
    const startAt = now.toISOString();
    const endAt = now.add(duration, 'w').toISOString();

    this.state = {
      formData: {
        name: sprint?.name,
        duration,
        startAt,
        endAt,
        goal: null,
      },
      isValidationEnabled: false,
    };
  }

  componentDidMount() {
    const { generateRefs } = this.props;
    generateRefs(Object.keys(validationSchema.fields));
  }

  handleChange = (key, value) => {
    const { validate } = this.props;
    const { isValidationEnabled } = this.state;

    if (key === 'duration' && value !== null) {
      const now = moment();

      this.setState(prevState => {
        const prevFormData = { ...prevState.formData };
        const startAt = value > 0 ? now.toISOString() : prevFormData?.startAt;
        const endAt =
          value > 0 ? now.add(value, 'w').toISOString() : prevFormData?.endAt;

        const formData = {
          ...prevFormData,
          [key]: value,
          startAt,
          endAt,
        };

        if (isValidationEnabled) {
          validate(formData, validationSchema);
        }

        return {
          formData,
        };
      });
    } else {
      // eslint-disable-next-line no-console
      console.log({ key, value });

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
    }
  };

  handleSubmit = () => {
    const {
      sprint: { id: sprintId },
      onSubmit,
      validate,
    } = this.props;
    const { formData, isValidationEnabled } = this.state;

    if (!isValidationEnabled) {
      this.setState({ isValidationEnabled: true });
    }

    const isValid = validate(formData, validationSchema, true);

    if (isValid) {
      const sprint = startSprintTransform(formData);
      onSubmit(sprintId, sprint);
    }
  };

  render() {
    const { errors, formRefs, onCancel } = this.props;
    const { formData } = this.state;
    return (
      <StartSprintForm
        formData={formData}
        errors={errors}
        formRefs={formRefs}
        onCancel={onCancel}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default withValidation(StartSprintFormContainer);
