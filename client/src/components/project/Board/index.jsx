import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  clearIssuesAction,
  clearIssuesMetadataAction,
  getBacklogIssuesAction,
  getIssueAction,
  getIssuesAction,
  getSprintIssuesAction,
  sendIssueToBottomOfBacklogAction,
  sendIssueToSprintAction,
  sendIssueToTopOfBacklogAction,
  updateIssueAction,
  updateIssueOrdinalsAction,
  updateIssuesAction,
} from 'actions/issue';
import { BoardType } from 'constants/project';

import Board from './Board';

class BoardContainer extends Component {
  static propTypes = {
    project: PropTypes.objectOf(PropTypes.any).isRequired,
    board: PropTypes.objectOf(PropTypes.any).isRequired,
    issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
    clearIssues: PropTypes.func.isRequired,
    clearIssuesMetadata: PropTypes.func.isRequired,
    getIssue: PropTypes.func.isRequired,
    getIssues: PropTypes.func.isRequired,
    getBacklogIssues: PropTypes.func.isRequired,
    getSprintIssues: PropTypes.func.isRequired,
    sendIssueToBottomOfBacklog: PropTypes.func.isRequired,
    sendIssueToTopOfBacklog: PropTypes.func.isRequired,
    sendIssueToSprint: PropTypes.func.isRequired,
    updateIssue: PropTypes.func.isRequired,
    updateIssues: PropTypes.func.isRequired,
    updateIssueOrdinals: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { project, clearIssues, clearIssuesMetadata, getIssues } = this.props;
    clearIssues();
    clearIssuesMetadata();
    getIssues(project?.id);
  }

  componentWillUnmount() {
    const { clearIssues, clearIssuesMetadata } = this.props;
    clearIssues();
    clearIssuesMetadata();
  }

  handleSendIssueToSprint = (issueId, sprintId, status) => {
    const {
      project: { id: projectId },
      sendIssueToSprint,
      getBacklogIssues,
      getSprintIssues,
    } = this.props;

    const callback = () => {
      getBacklogIssues(projectId);
      getSprintIssues(projectId, sprintId);
    };

    sendIssueToSprint(projectId, sprintId, issueId, null, status, callback);
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

  handleUpdateIssues = issues => {
    const { updateIssues } = this.props;
    updateIssues(issues);
  };

  handleUpdateIssueOrdinals = (issueOrdinals, sprintId) => {
    const {
      project: { id: projectId },
      getBacklogIssues,
      getSprintIssues,
      updateIssueOrdinals,
    } = this.props;

    const callback = () => {
      if (sprintId) {
        getSprintIssues(projectId, sprintId);
      } else {
        getBacklogIssues(projectId);
      }
    };

    updateIssueOrdinals(projectId, issueOrdinals, sprintId, callback);
  };

  render() {
    const { board, issues } = this.props;

    return (
      <Board
        board={board}
        issues={issues}
        onSendIssueToBottomOfBacklog={this.handleSendIssueToBottomOfBacklog}
        onSendIssueToTopOfBacklog={this.handleSendIssueToTopOfBacklog}
        onSendIssueToSprint={this.handleSendIssueToSprint}
        onUpdateIssue={this.handleUpdateIssue}
        onUpdateIssues={this.handleUpdateIssues}
        onUpdateIssueOrdinals={this.handleUpdateIssueOrdinals}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  const {
    board: { type: boardType },
  } = props;
  let issues = [];

  if (boardType === BoardType.SCRUM) {
    issues = state.issueStore.issues.filter(issue => !!issue.sprintId);
  } else {
    issues = state.issueStore.issues.filter(issue => !issue.sprintId);
  }

  return {
    issues,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearIssues: clearIssuesAction,
      clearIssuesMetadata: clearIssuesMetadataAction,
      getBacklogIssues: getBacklogIssuesAction,
      getIssue: getIssueAction,
      getIssues: getIssuesAction,
      getSprintIssues: getSprintIssuesAction,
      sendIssueToBottomOfBacklog: sendIssueToBottomOfBacklogAction,
      sendIssueToTopOfBacklog: sendIssueToTopOfBacklogAction,
      sendIssueToSprint: sendIssueToSprintAction,
      updateIssue: updateIssueAction,
      updateIssues: updateIssuesAction,
      updateIssueOrdinals: updateIssueOrdinalsAction,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BoardContainer);
