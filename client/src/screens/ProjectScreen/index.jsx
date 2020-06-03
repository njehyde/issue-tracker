import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  createIssueAction,
  getIssueStatusesAction,
  getIssueTypesAction,
  getPriorityTypesAction,
} from 'actions/issue';
import { getProjectAction, setActiveProjectIdAction } from 'actions/project';

import ProjectScreen from './ProjectScreen';

class ProjectScreenContainer extends Component {
  static propTypes = {
    match: PropTypes.objectOf(PropTypes.any).isRequired,
    createIssue: PropTypes.func.isRequired,
    location: PropTypes.objectOf(PropTypes.any),
    project: PropTypes.objectOf(PropTypes.any),
    getIssueStatuses: PropTypes.func.isRequired,
    getIssueTypes: PropTypes.func.isRequired,
    getPriorityTypes: PropTypes.func.isRequired,
    getProject: PropTypes.func.isRequired,
    setActiveProjectId: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const {
      project,
      match,
      getIssueStatuses,
      getIssueTypes,
      getPriorityTypes,
    } = this.props;
    const projectId = match?.params?.id;

    if (!project || project?.id !== projectId) {
      const { getProject, setActiveProjectId } = this.props;
      getProject(projectId);
      setActiveProjectId(projectId);
    }

    getIssueStatuses();
    getIssueTypes();
    getPriorityTypes();
  }

  handleAddIssue = issue => {
    const { createIssue } = this.props;
    createIssue(issue);
  };

  render() {
    const { location, project } = this.props;
    const { pathname } = location;
    const { defaultBoardId, boards } = project || {};
    const defaultBoard =
      boards && boards.find(board => board.id === defaultBoardId);
    const { isBacklogVisible, isBoardVisible } = defaultBoard || {};

    if (!pathname.includes('/board') && !pathname.includes('/backlog')) {
      if (isBacklogVisible || isBoardVisible) {
        const defaultScreen = isBoardVisible ? 'board' : 'backlog';
        return <Redirect to={`${pathname}/${defaultScreen}`} />;
      }
      return <Redirect to="/projects" />;
    }

    return <ProjectScreen project={project} onAddIssue={this.handleAddIssue} />;
  }
}

const mapStateToProps = state => {
  const { projects = [], activeProjectId } = state.projectStore;
  return {
    project: projects.find(p => p.id === activeProjectId),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createIssue: createIssueAction,
      getIssueStatuses: getIssueStatusesAction,
      getIssueTypes: getIssueTypesAction,
      getPriorityTypes: getPriorityTypesAction,
      getProject: getProjectAction,
      setActiveProjectId: setActiveProjectIdAction,
    },
    dispatch,
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectScreenContainer),
);
