import { ProjectAction } from 'constants/actionTypes';
import { showErrorAlert, showQueryErrorAlert } from 'services/notifications';

import {
  removeSprintIssuesMetadata,
  clearBacklogIssuesMetadata,
} from './issue';

export const addProject = project => ({
  type: ProjectAction.ADD_PROJECT,
  payload: project,
});

export const addProjects = projects => ({
  type: ProjectAction.ADD_PROJECTS,
  payload: projects,
});

export const clearProjects = () => ({
  type: ProjectAction.CLEAR_PROJECTS,
});

export const clearProjectsMetadata = () => ({
  type: ProjectAction.CLEAR_PROJECTS_METADATA,
});

export const setActiveBoardId = boardId => ({
  type: ProjectAction.SET_ACTIVE_BOARD_ID,
  payload: boardId,
});

export const setActiveProjectId = projectId => ({
  type: ProjectAction.SET_ACTIVE_PROJECT_ID,
  payload: projectId,
});

export const setBoardTypes = boardTypes => ({
  type: ProjectAction.SET_BOARD_TYPES,
  payload: boardTypes,
});

export const setIsLoading = isLoading => ({
  type: ProjectAction.SET_IS_LOADING,
  payload: isLoading,
});

export const setProjectsMetadata = metadata => ({
  type: ProjectAction.SET_PROJECTS_METADATA,
  payload: metadata,
});

export const setProjectTypes = projectTypes => ({
  type: ProjectAction.SET_PROJECT_TYPES,
  payload: projectTypes,
});

export const updateProjectBoard = (projectId, board) => ({
  type: ProjectAction.UPDATE_PROJECT_BOARD,
  payload: {
    projectId,
    board,
  },
});

export const addProjectAction = project => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: ProjectAction.CREATE_PROJECT,
    payload: {
      request: {
        method: 'POST',
        url: '/projects',
        data: { ...project },
      },
    },
  }).then(({ type }) => {
    if (type === `${ProjectAction.CREATE_PROJECT_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(addProject(project));
    }
    if (type === `${ProjectAction.CREATE_PROJECT_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't save your project. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const clearActiveBoardIdAction = () => dispatch => {
  dispatch(setActiveBoardId(null));
};

export const clearActiveProjectIdAction = () => dispatch => {
  dispatch(setActiveProjectId(null));
};

export const clearProjectsAction = () => dispatch => {
  dispatch(clearProjects());
};

export const clearProjectsMetadataAction = () => dispatch => {
  dispatch(clearProjectsMetadata());
};

export const createSprintAction = (
  projectId,
  boardId,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: ProjectAction.CREATE_SPRINT,
    payload: {
      request: {
        method: 'POST',
        url: `/projects/${projectId}/boards/${boardId}/sprints`,
      },
    },
  }).then(({ type }) => {
    if (type === `${ProjectAction.CREATE_SPRINT_SUCCESS}`) {
      dispatch(setIsLoading(false));
      if (callback) {
        callback();
      }
    }
    if (type === `${ProjectAction.CREATE_SPRINT_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't create your sprint. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const deleteSprintAction = (
  projectId,
  boardId,
  sprintId,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));
  dispatch(removeSprintIssuesMetadata(sprintId));

  return dispatch({
    type: ProjectAction.DELETE_SPRINT,
    payload: {
      request: {
        method: 'DELETE',
        url: `/projects/${projectId}/boards/${boardId}/sprints/${sprintId}`,
      },
    },
  }).then(({ type }) => {
    if (type === `${ProjectAction.DELETE_SPRINT_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(clearBacklogIssuesMetadata());
      if (callback) {
        callback();
      }
    }
    if (type === `${ProjectAction.DELETE_SPRINT_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't delete your sprint. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const getBoardTypesAction = () => (dispatch, getState) => {
  const state = getState();
  const { boardTypes: currentBoardTypes } = state.projectStore || {};

  if (currentBoardTypes && !currentBoardTypes?.length) {
    dispatch(setIsLoading(true));

    return dispatch({
      type: ProjectAction.GET_BOARD_TYPES,
      payload: {
        request: {
          method: 'GET',
          url: '/boardTypes',
        },
      },
    }).then(({ type, payload }) => {
      if (type === `${ProjectAction.GET_BOARD_TYPES_SUCCESS}`) {
        dispatch(setIsLoading(false));
        const { boardTypes } = payload;
        dispatch(setBoardTypes(boardTypes));
      }
      if (type === `${ProjectAction.GET_BOARD_TYPES_FAIL}`) {
        showQueryErrorAlert();
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const getProjectAction = projectId => dispatch => {
  dispatch(setIsLoading(true));
  // dispatch(clearAllIssueMetadatas());

  return dispatch({
    type: ProjectAction.GET_PROJECT,
    payload: {
      request: {
        method: 'GET',
        url: `/projects/${projectId}`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${ProjectAction.GET_PROJECT_SUCCESS}`) {
      const { project } = payload;

      dispatch(setIsLoading(false));
      dispatch(addProject(project));
    }
    if (type === `${ProjectAction.GET_PROJECT_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getProjectBoardAction = (projectId, boardId) => dispatch => {
  if (!projectId || !boardId) {
    return null;
  }

  dispatch(setIsLoading(true));

  return dispatch({
    type: ProjectAction.GET_PROJECT_BOARD,
    payload: {
      request: {
        method: 'GET',
        url: `/projects/${projectId}/boards/${boardId}`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${ProjectAction.GET_PROJECT_BOARD_SUCCESS}`) {
      const { board } = payload;

      dispatch(setIsLoading(false));
      dispatch(updateProjectBoard(projectId, board));
    }
    if (type === `${ProjectAction.GET_PROJECT_BOARD_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getProjectsAction = () => (dispatch, getState) => {
  dispatch(setIsLoading(true));

  const state = getState();
  const { pageSize = 100, cursor = '' } =
    state?.projectStore?.projectsMetadata?.pagination || {};

  return dispatch({
    type: ProjectAction.GET_PROJECTS,
    payload: {
      request: {
        method: 'GET',
        url: `/projects?pageSize=${pageSize}${cursor && `&cursor=${cursor}`}`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${ProjectAction.GET_PROJECTS_SUCCESS}`) {
      const { projects, metadata } = payload;

      dispatch(setIsLoading(false));
      dispatch(addProjects(projects));
      dispatch(setProjectsMetadata(metadata));
    }
    if (type === `${ProjectAction.GET_PROJECTS_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getProjectTypesAction = () => (dispatch, getState) => {
  const state = getState();
  const { projectTypes: currentProjectTypes } = state.projectStore || {};

  if (currentProjectTypes && !currentProjectTypes.length) {
    dispatch(setIsLoading(true));

    return dispatch({
      type: ProjectAction.GET_PROJECT_TYPES,
      payload: {
        request: {
          method: 'GET',
          url: '/projectTypes',
        },
      },
    }).then(({ type, payload }) => {
      if (type === `${ProjectAction.GET_PROJECT_TYPES_SUCCESS}`) {
        dispatch(setIsLoading(false));
        const { projectTypes } = payload;
        dispatch(setProjectTypes(projectTypes));
      }
      if (type === `${ProjectAction.GET_PROJECT_TYPES_FAIL}`) {
        showQueryErrorAlert();
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const setActiveBoardIdAction = boardId => dispatch => {
  dispatch(setActiveBoardId(boardId));
};

export const setActiveProjectIdAction = projectId => dispatch => {
  dispatch(setActiveProjectId(projectId));
};

export const updateSprintAction = (
  projectId,
  boardId,
  sprintId,
  sprint,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: ProjectAction.UPDATE_SPRINT,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/boards/${boardId}/sprints/${sprintId}`,
        data: {
          ...sprint,
        },
      },
    },
  }).then(({ type }) => {
    if (type === `${ProjectAction.UPDATE_SPRINT_SUCCESS}`) {
      dispatch(setIsLoading(false));
      if (callback) {
        callback();
      }
    }
    if (type === `${ProjectAction.UPDATE_SPRINT_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't update your sprint. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};
