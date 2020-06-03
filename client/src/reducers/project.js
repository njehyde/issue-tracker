import mapActionToReducer from 'redux-action-reducer-mapper';
import { ProjectAction } from 'constants/actionTypes';
import { defaultProjectMetadata } from 'constants/project';
import { getArrayIndexForId, updateArrayByIndex } from 'utils/index';

export const initialState = {
  isLoading: false,
  activeProjectId: null,
  activeBoardId: null,
  boardTypes: [],
  projects: [],
  projectsMetadata: { ...defaultProjectMetadata },
  projectTypes: [],
};

const addProject = (state, action) => {
  let updatedArray;
  const project = action.payload;
  const index = getArrayIndexForId(state.projects, project?.id);

  if (index === -1) {
    updatedArray = [...state.projects, project];
  } else {
    updatedArray = updateArrayByIndex(state.projects, index, project);
  }

  return {
    ...state,
    projects: updatedArray,
  };
};

const addProjects = (state, action) => {
  const { payload: projects } = action;

  const updatedProjects = state.projects.map(project => {
    const existingProject = projects.find(
      existing => existing.id === project.id,
    );
    if (existingProject) {
      return existingProject;
    }
    return project;
  });

  const newProjects =
    (projects &&
      projects.filter(
        project => !state.projects.find(existing => existing.id === project.id),
      )) ||
    [];

  return {
    ...state,
    projects: [...updatedProjects, ...newProjects],
  };
};

const clearProjectsMetadata = state => ({
  ...state,
  projectsMetadata: { ...defaultProjectMetadata },
});

const clearProjects = state => ({
  ...state,
  projects: [],
});

const setActiveBoardId = (state, action) => ({
  ...state,
  activeBoardId: action.payload,
});

const setActiveProjectId = (state, action) => ({
  ...state,
  activeProjectId: action.payload,
});

const setBoardTypes = (state, action) => ({
  ...state,
  boardTypes: [...action.payload],
});

const setIsLoading = (state, action) => ({
  ...state,
  isLoading: action.payload,
});

const setProjectTypes = (state, action) => ({
  ...state,
  projectTypes: [...action.payload],
});

const setProjectsMetadata = (state, action) => ({
  ...state,
  projectsMetadata: { ...action.payload },
});

const reducer = mapActionToReducer({
  default: initialState,
  [ProjectAction.ADD_PROJECT]: addProject,
  [ProjectAction.ADD_PROJECTS]: addProjects,
  [ProjectAction.CLEAR_PROJECTS_METADATA]: clearProjectsMetadata,
  [ProjectAction.CLEAR_PROJECTS]: clearProjects,
  [ProjectAction.SET_ACTIVE_BOARD_ID]: setActiveBoardId,
  [ProjectAction.SET_ACTIVE_PROJECT_ID]: setActiveProjectId,
  [ProjectAction.SET_BOARD_TYPES]: setBoardTypes,
  [ProjectAction.SET_IS_LOADING]: setIsLoading,
  [ProjectAction.SET_PROJECT_TYPES]: setProjectTypes,
  [ProjectAction.SET_PROJECTS_METADATA]: setProjectsMetadata,
});

export default reducer;
