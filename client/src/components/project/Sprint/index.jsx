import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  clearSprintIssuesAction,
  getSprintIssuesAction,
  removeSprintIssuesMetadataAction,
} from 'actions/issue';
import { applySprintFilter } from 'utils/issue';

import Sprint from './Sprint';

class SprintContainer extends Component {
  static propTypes = {
    project: PropTypes.objectOf(PropTypes.any).isRequired,
    board: PropTypes.objectOf(PropTypes.any).isRequired,
    sprint: PropTypes.objectOf(PropTypes.any).isRequired,
    issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    issuesCount: PropTypes.number,
    clearSprintIssues: PropTypes.func.isRequired,
    removeSprintIssuesMetadata: PropTypes.func.isRequired,
    getSprintIssues: PropTypes.func.isRequired,
    onClickIssue: PropTypes.func.isRequired,
    onDeleteSprint: PropTypes.func.isRequired,
    onEditSprint: PropTypes.func.isRequired,
    onStartSprint: PropTypes.func.isRequired,
    onSendIssueToSprint: PropTypes.func.isRequired,
    onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
    onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      project,
      sprint: { id: sprintId },
      clearSprintIssues,
      getSprintIssues,
      removeSprintIssuesMetadata,
    } = this.props;
    clearSprintIssues(sprintId);
    removeSprintIssuesMetadata(sprintId);
    getSprintIssues(project?.id, sprintId);
  }

  componentWillUnmount() {
    const {
      sprint: { id: sprintId },
      clearSprintIssues,
      removeSprintIssuesMetadata,
    } = this.props;
    clearSprintIssues(sprintId);
    removeSprintIssuesMetadata(sprintId);
  }

  render() {
    const {
      board,
      sprint,
      issues,
      issuesCount,
      onClickIssue,
      onDeleteSprint,
      onEditSprint,
      onStartSprint,
      onSendIssueToSprint,
      onSendIssueToTopOfBacklog,
      onSendIssueToBottomOfBacklog,
    } = this.props;
    return (
      <Sprint
        board={board}
        sprint={sprint}
        issues={issues}
        issuesCount={issuesCount}
        onClickIssue={onClickIssue}
        onEditSprint={onEditSprint}
        onDeleteSprint={onDeleteSprint}
        onStartSprint={onStartSprint}
        onSendIssueToSprint={onSendIssueToSprint}
        onSendIssueToTopOfBacklog={onSendIssueToTopOfBacklog}
        onSendIssueToBottomOfBacklog={onSendIssueToBottomOfBacklog}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    sprint: { id: sprintId },
  } = props;
  const issues = applySprintFilter(sprintId, state.issueStore.issues).sort(
    (a, b) => a?.ordinal - b?.ordinal,
  );
  const { sprintIssuesMetadatas } = state?.issueStore;
  const sprintIssuesMetadata = sprintIssuesMetadatas?.find(
    ({ id }) => id === sprintId,
  );
  const { count: issuesCount } = sprintIssuesMetadata?.metadata || {};
  return {
    issues,
    issuesCount,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearSprintIssues: clearSprintIssuesAction,
      removeSprintIssuesMetadata: removeSprintIssuesMetadataAction,
      getSprintIssues: getSprintIssuesAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SprintContainer);
