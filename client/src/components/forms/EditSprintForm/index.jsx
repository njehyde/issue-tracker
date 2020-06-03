import React, { Component } from 'react';
import PropTypes from 'prop-types';

import withValidation from 'hocs/withValidation';
import { editSprintTransform } from 'transforms/project';

import EditSprintForm from './EditSprintForm';
import validationSchema from './validation';

class EditSprintFormContainer extends Component {
  static propTypes = {
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    generateRefs: PropTypes.func.isRequired,
    sprint: PropTypes.objectOf(PropTypes.any).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { sprint } = props;

    this.state = {
      formData: {
        name: sprint?.name || '',
        goal: sprint?.goal || '',
        startAt: sprint?.startAt,
        endAt: sprint?.endAt,
      },
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
      const sprint = editSprintTransform(formData);
      onSubmit(sprintId, sprint);
    }
  };

  render() {
    const { errors, formRefs, onCancel } = this.props;
    const { formData } = this.state;
    return (
      <EditSprintForm
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

export default withValidation(EditSprintFormContainer);
