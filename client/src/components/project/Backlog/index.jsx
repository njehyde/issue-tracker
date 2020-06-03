import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  clearBacklogIssuesAction,
  clearBacklogIssuesMetadataAction,
  getBacklogIssuesAction,
  getIssueAction,
  getSprintIssuesAction,
  sendIssueToBottomOfBacklogAction,
  sendIssueToSprintAction,
  sendIssueToTopOfBacklogAction,
  updateIssueAction,
} from 'actions/issue';
import {
  createSprintAction,
  deleteSprintAction,
  getProjectAction,
  updateSprintAction,
} from 'actions/project';
import { applyBacklogFilter } from 'utils/issue';

import Backlog from './Backlog';

class BacklogContainer extends Component {
  static propTypes = {
    board: PropTypes.objectOf(PropTypes.any).isRequired,
    issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    issuesCount: PropTypes.number,
    project: PropTypes.objectOf(PropTypes.any).isRequired,
    clearBacklogIssues: PropTypes.func.isRequired,
    clearBacklogIssuesMetadata: PropTypes.func.isRequired,
    createSprint: PropTypes.func.isRequired,
    deleteSprint: PropTypes.func.isRequired,
    getBacklogIssues: PropTypes.func.isRequired,
    getIssue: PropTypes.func.isRequired,
    getProject: PropTypes.func.isRequired,
    getSprintIssues: PropTypes.func.isRequired,
    sendIssueToBottomOfBacklog: PropTypes.func.isRequired,
    sendIssueToSprint: PropTypes.func.isRequired,
    sendIssueToTopOfBacklog: PropTypes.func.isRequired,
    updateIssue: PropTypes.func.isRequired,
    updateSprint: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      project,
      clearBacklogIssues,
      clearBacklogIssuesMetadata,
      getBacklogIssues,
    } = this.props;
    clearBacklogIssues();
    clearBacklogIssuesMetadata();
    getBacklogIssues(project?.id);
  }

  componentWillUnmount() {
    const { clearBacklogIssues, clearBacklogIssuesMetadata } = this.props;
    clearBacklogIssues();
    clearBacklogIssuesMetadata();
  }

  handleCreateSprint = () => {
    const {
      project: { id: projectId },
      board: { id: boardId },
      createSprint,
      getProject,
    } = this.props;

    const callback = () => {
      getProject(projectId);
    };

    createSprint(projectId, boardId, callback);
  };

  handleDeleteSprint = sprintId => {
    const {
      project: { id: projectId },
      board: { id: boardId },
      deleteSprint,
      getProject,
      getBacklogIssues,
    } = this.props;

    const callback = () => {
      getProject(projectId);
      getBacklogIssues(projectId);
    };

    deleteSprint(projectId, boardId, sprintId, callback);
  };

  handleUpdateIssue = issue => {
    const { id: issueId } = issue || {};
    const {
      project: { id: projectId },
      getIssue,
      updateIssue,
    } = this.props;

    const callback = () => {
      getIssue(issueId);
    };

    updateIssue(projectId, issue, callback);
  };

  handleSendIssueToBottomOfBacklog = (issueId, fromSprintId) => {
    const {
      project: { id: projectId },
      sendIssueToBottomOfBacklog,
      getBacklogIssues,
      getSprintIssues,
    } = this.props;

    const callback = () => {
      getBacklogIssues(projectId);
      if (fromSprintId) {
        getSprintIssues(projectId, fromSprintId);
      }
    };

    sendIssueToBottomOfBacklog(projectId, issueId, fromSprintId, callback);
  };

  handleSendIssueToTopOfBacklog = (issueId, fromSprintId) => {
    const {
      project: { id: projectId },
      sendIssueToTopOfBacklog,
      getBacklogIssues,
      getSprintIssues,
    } = this.props;

    const callback = () => {
      getBacklogIssues(projectId);
      if (fromSprintId) {
        getSprintIssues(projectId, fromSprintId);
      }
    };

    sendIssueToTopOfBacklog(projectId, issueId, fromSprintId, callback);
  };

  handleSendIssueToSprint = (issueId, sprintId, fromSprintId) => {
    const {
      project: { id: projectId },
      sendIssueToSprint,
      getBacklogIssues,
      getSprintIssues,
    } = this.props;

    const callback = () => {
      getBacklogIssues(projectId);
      getSprintIssues(projectId, sprintId);
      if (fromSprintId) {
        getSprintIssues(projectId, fromSprintId);
      }
    };

    sendIssueToSprint(
      projectId,
      sprintId,
      issueId,
      fromSprintId,
      null,
      callback,
    );
  };

  handleUpdateSprint = (sprintId, sprint) => {
    const {
      project: { id: projectId },
      board: { id: boardId },
      getProject,
      updateSprint,
    } = this.props;

    const callback = () => {
      getProject(projectId);
    };

    updateSprint(projectId, boardId, sprintId, sprint, callback);
  };

  render() {
    const { project, board, issues, issuesCount } = this.props;
    return (
      <Backlog
        project={project}
        board={board}
        issues={issues}
        issuesCount={issuesCount}
        onCreateSprint={this.handleCreateSprint}
        onDeleteSprint={this.handleDeleteSprint}
        onUpdateIssue={this.handleUpdateIssue}
        onSendIssueToBottomOfBacklog={this.handleSendIssueToBottomOfBacklog}
        onSendIssueToTopOfBacklog={this.handleSendIssueToTopOfBacklog}
        onSendIssueToSprint={this.handleSendIssueToSprint}
        onUpdateSprint={this.handleUpdateSprint}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const { activeBoardId } = state.projectStore;
  const { project } = props;
  const board = project?.boards.find(b => b.id === activeBoardId);
  const issues = applyBacklogFilter(state.issueStore.issues).sort(
    (a, b) => a?.ordinal - b?.ordinal,
  );
  const { count: issuesCount } = state?.issueStore?.backlogIssuesMetadata || {};

  return {
    board,
    issues,
    issuesCount,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearBacklogIssues: clearBacklogIssuesAction,
      clearBacklogIssuesMetadata: clearBacklogIssuesMetadataAction,
      createSprint: createSprintAction,
      deleteSprint: deleteSprintAction,
      getBacklogIssues: getBacklogIssuesAction,
      getIssue: getIssueAction,
      getProject: getProjectAction,
      getSprintIssues: getSprintIssuesAction,
      sendIssueToBottomOfBacklog: sendIssueToBottomOfBacklogAction,
      sendIssueToSprint: sendIssueToSprintAction,
      sendIssueToTopOfBacklog: sendIssueToTopOfBacklogAction,
      updateIssue: updateIssueAction,
      updateSprint: updateSprintAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BacklogContainer);
