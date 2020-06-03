import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withClient from 'hocs/withClient';
import withValidation from 'hocs/withValidation';
import { addProjectTransform } from 'transforms/project';

import AddProjectForm from './AddProjectForm';
import validationSchema from './validation';

class AddProjectFormContainer extends Component {
  static propTypes = {
    boardTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    client: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    projectTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
      .isRequired,
    userId: PropTypes.string.isRequired,
    asyncValidate: PropTypes.func.isRequired,
    generateRefs: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { boardTypes, projectTypes } = props;
    const defaultBoardType = (boardTypes || []).find(type => type.default);
    const defaultProjectType = (projectTypes || []).find(type => type.default);

    this.state = {
      formData: {
        key: '',
        name: '',
        type: defaultProjectType?.id,
        description: '',
        leadId: props.userId,
        defaultAssigneeId: props.userId,
        defaultBoardType: defaultBoardType?.id,
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
      const skipKeyAsyncCheck = key !== 'key';
      const isKeyValid = !errors.key;
      await asyncValidate(updatedFormData, validationSchema, false, null, {
        skipKeyAsyncCheck,
        isKeyValid,
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
      const project = addProjectTransform(formData);
      onSubmit(project);
    }
  };

  handleLoadUsers = (inputValue, value, callback) => {
    const { client } = this.props;

    return client.get(`/users?term=${inputValue}`).then(response => {
      const { users } = response;
      const transformedUsers = users.map(user => ({
        label: `${user?.name?.firstName} ${user?.name?.lastName}`,
        value: user.id,
      }));
      const matched = transformedUsers.find(option => option.value === value);

      callback(transformedUsers, matched);
    });
  };

  render() {
    const { boardTypes, projectTypes, errors, formRefs, onCancel } = this.props;
    const { formData } = this.state;
    return (
      <AddProjectForm
        formData={formData}
        boardTypes={boardTypes}
        projectTypes={projectTypes}
        errors={errors}
        formRefs={formRefs}
        onChange={this.handleChange}
        onLoadUsers={this.handleLoadUsers}
        onSubmit={this.handleSubmit}
        onCancel={onCancel}
      />
    );
  }
}

const mapStateToProps = state => ({
  userId: state.authStore.user.id,
  boardTypes: state.projectStore.boardTypes,
  projectTypes: state.projectStore.projectTypes,
});

export default connect(mapStateToProps)(
  withClient(withValidation(AddProjectFormContainer)),
);
