import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import withClient from 'hocs/withClient';
import withValidation from 'hocs/withValidation';
import { addIssueTransform } from 'transforms/issue';

import AddIssueForm from './AddIssueForm';
import validationSchema from './validation';

class AddIssueFormContainer extends Component {
  static propTypes = {
    client: PropTypes.objectOf(PropTypes.any).isRequired,
    errors: PropTypes.objectOf(PropTypes.any).isRequired,
    formRefs: PropTypes.objectOf(PropTypes.any).isRequired,
    generateRefs: PropTypes.func.isRequired,
    issueStatuses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
      .isRequired,
    issueTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    priorityTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any))
      .isRequired,
    projectId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    validate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const {
      issueStatuses,
      issueTypes,
      priorityTypes,
      projectId,
      userId,
    } = props;
    const defaultIssueStatus = (issueStatuses || []).find(
      status => status.default,
    );
    const defaultIssueType = (issueTypes || []).find(type => type.default);
    const defaultPriorityType = (priorityTypes || []).find(
      type => type.default,
    );

    this.state = {
      formData: {
        projectId,
        type: defaultIssueType?.id,
        summary: '',
        description: '',
        status: defaultIssueStatus?.id,
        reporterId: userId,
        assigneeId: null,
        priority: defaultPriorityType?.id,
        points: 0,
        labels: [],
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
    // eslint-disable-next-line no-console
    console.log('handleSubmit', { isValid, formData });

    if (isValid) {
      const issue = addIssueTransform(formData);
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

  handleLoadProjects = (inputValue, value, callback) => {
    const { client } = this.props;

    return client.get('/projects').then(response => {
      const { projects } = response;
      const transformedProjects = projects.map(project => ({
        label: `${project.name} (${project.key})`,
        value: project.id,
      }));
      const matched = transformedProjects.find(
        option => option.value === value,
      );

      callback(transformedProjects, matched);
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
    const {
      errors,
      formRefs,
      issueTypes,
      priorityTypes,
      onCancel,
    } = this.props;
    const { formData } = this.state;
    return (
      <AddIssueForm
        formData={formData}
        errors={errors}
        formRefs={formRefs}
        issueTypes={issueTypes}
        priorityTypes={priorityTypes}
        onCancel={onCancel}
        onChange={this.handleChange}
        onLoadLabels={this.handleLoadLabels}
        onLoadProjects={this.handleLoadProjects}
        onLoadUsers={this.handleLoadUsers}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = state => ({
  issueStatuses: state.issueStore.issueStatuses,
  issueTypes: state.issueStore.issueTypes,
  priorityTypes: state.issueStore.priorityTypes,
  projectId: state.projectStore.activeProjectId,
  userId: state.authStore.user.id,
});

export default connect(mapStateToProps)(
  withClient(withValidation(AddIssueFormContainer)),
);
