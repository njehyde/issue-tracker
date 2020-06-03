import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  addProjectAction,
  clearActiveProjectIdAction,
  clearActiveBoardIdAction,
  clearProjectsAction,
  getBoardTypesAction,
  getProjectsAction,
  getProjectTypesAction,
  clearProjectsMetadataAction,
  setActiveProjectIdAction,
  setActiveBoardIdAction,
} from 'actions/project';

import ProjectsScreen from './ProjectsScreen';

class ProjectsScreenContainer extends Component {
  static propTypes = {
    projects: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
    addProject: PropTypes.func.isRequired,
    clearActiveProjectId: PropTypes.func.isRequired,
    clearActiveBoardId: PropTypes.func.isRequired,
    clearProjects: PropTypes.func.isRequired,
    getBoardTypes: PropTypes.func.isRequired,
    getProjects: PropTypes.func.isRequired,
    getProjectTypes: PropTypes.func.isRequired,
    clearProjectsMetadata: PropTypes.func.isRequired,
    setActiveProjectId: PropTypes.func.isRequired,
    setActiveBoardId: PropTypes.func.isRequired,
    history: PropTypes.objectOf(PropTypes.any),
  };

  componentDidMount() {
    const {
      clearActiveBoardId,
      clearActiveProjectId,
      clearProjects,
      clearProjectsMetadata,
      getBoardTypes,
      getProjects,
      getProjectTypes,
    } = this.props;

    clearActiveProjectId();
    clearActiveBoardId();
    clearProjects();
    clearProjectsMetadata();
    getBoardTypes();
    getProjects();
    getProjectTypes();
  }

  handleAddProject = project => {
    const { addProject } = this.props;
    addProject(project);
  };

  handleSelectProject = project => {
    const { history, setActiveProjectId, setActiveBoardId } = this.props;
    setActiveProjectId(project?.id);
    setActiveBoardId(project?.boards[0]?.id);

    // Decide here whether to direct to the board or backlog
    const { defaultBoardId, boards } = project || {};
    const defaultBoard =
      boards && boards.find(board => board.id === defaultBoardId);
    const { isBacklogVisible, isBoardVisible } = defaultBoard || {};

    if (isBoardVisible) {
      history.push(`/projects/${project.id}/board`);
    } else if (isBacklogVisible) {
      history.push(`/projects/${project.id}/backlog`);
    } else {
      history.push(`/projects/${project.id}`);
    }
  };

  render() {
    const { projects } = this.props;
    return (
      <ProjectsScreen
        projects={projects}
        onAddProject={this.handleAddProject}
        onSelectProject={this.handleSelectProject}
      />
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projectStore.projects || [],
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addProject: addProjectAction,
      clearActiveProjectId: clearActiveProjectIdAction,
      clearActiveBoardId: clearActiveBoardIdAction,
      clearProjects: clearProjectsAction,
      getBoardTypes: getBoardTypesAction,
      getProjects: getProjectsAction,
      getProjectTypes: getProjectTypesAction,
      clearProjectsMetadata: clearProjectsMetadataAction,
      setActiveProjectId: setActiveProjectIdAction,
      setActiveBoardId: setActiveBoardIdAction,
    },
    dispatch,
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProjectsScreenContainer),
);
