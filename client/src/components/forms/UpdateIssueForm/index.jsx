import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withClient from 'hocs/withClient';
import withValidation from 'hocs/withValidation';
import { updateIssueTransform } from 'transforms/issue';

import UpdateIssueForm from './UpdateIssueForm';
import validationSchema from './validation';

class UpdateIssueFormContainer extends Component {
  static propTypes = {
    client: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    issue: PropTypes.objectOf(PropTypes.any).isRequired,
    generateRefs: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { issue } = props;
    this.state = {
      formData: {
        id: issue?.id,
        sprintId: issue?.sprintId,
        projectId: issue?.projectId,
        type: issue?.type,
        summary: issue?.summary,
        description: issue?.description,
        status: issue?.status,
        reporterId: issue?.reporterId,
        assigneeId: issue?.assigneeId,
        priority: issue?.priority,
        points: issue?.points,
        labels: issue?.labels,
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
    const { onSubmit, validate } = this.props;
    const { formData, isValidationEnabled } = this.state;

    if (!isValidationEnabled) {
      this.setState({ isValidationEnabled: true });
    }

    const isValid = validate(formData, validationSchema, true);

    if (isValid) {
      const issue = updateIssueTransform(formData);
      onSubmit(issue);
    }
  };

  handleLoadLabels = (inputValue, value, callback) => {
    const { client } = this.props;

    return client.get(`/labels?term=${inputValue}`).then(response => {
      const { labels } = response;
      const transformedLabels = labels.map(label => ({
        label: `${label.label}`,
        value: label.label,
      }));
      const matched = value
        ? transformedLabels.filter(option => value.includes(option.value))
        : null;
      if (matched && matched.length) {
        callback(transformedLabels, matched);
      } else {
        callback(transformedLabels, null);
      }
    });
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
    const { errors, formRefs } = this.props;
    const { formData } = this.state;
    return (
      <UpdateIssueForm
        formData={formData}
        errors={errors}
        formRefs={formRefs}
        onChange={this.handleChange}
        onLoadLabels={this.handleLoadLabels}
        onLoadUsers={this.handleLoadUsers}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  userId: state.authStore.user.id,
  projectId: state.projectStore.activeProjectId,
});

export default connect(mapStateToProps)(
  withClient(withValidation(UpdateIssueFormContainer)),
);
