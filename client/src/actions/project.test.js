import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';
import MockAdapter from 'axios-mock-adapter';
import defaultClient from 'services/defaultClient';
import mocks from 'mocks';
import {
  ProjectAction as types,
  IssueAction as issueTypes,
} from 'constants/actionTypes';
import * as actions from 'actions/project';
import { initialState } from 'reducers/project';

// http://www.mong.life/2018/01/14/react-jest-unit-testing-with-redux-axios-middleware/
// https://www.npmjs.com/package/redux-axios-middleware
// https://stackoverflow.com/questions/56644982/how-to-test-redux-async-action-with-redux-axios-middleware
// https://github.com/svrcekmichal/redux-axios-middleware/issues/48

const MockAPI = new MockAdapter(defaultClient);

const middlewares = [
  thunk.withExtraArgument(defaultClient),
  axiosMiddleware(defaultClient),
];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  projectStore: { ...initialState },
});

describe('action creators', () => {
  it('should create an action to add a project', () => {
    const project = { ...mocks.project1 };
    const expectedAction = {
      type: types.ADD_PROJECT,
      payload: project,
    };
    expect(actions.addProject(project)).toEqual(expectedAction);
  });

  it('should create an action to add projects', () => {
    const projects = [
      { ...mocks.project1 },
      { ...mocks.project2 },
      { ...mocks.project3 },
    ];
    const expectedAction = {
      type: types.ADD_PROJECTS,
      payload: projects,
    };
    expect(actions.addProjects(projects)).toEqual(expectedAction);
  });

  it('should create an action to clear projects', () => {
    const expectedAction = {
      type: types.CLEAR_PROJECTS,
    };
    expect(actions.clearProjects()).toEqual(expectedAction);
  });

  it('should create an action to clear projects metadata', () => {
    const expectedAction = {
      type: types.CLEAR_PROJECTS_METADATA,
    };
    expect(actions.clearProjectsMetadata()).toEqual(expectedAction);
  });

  it('should create an action to set an active board', () => {
    const boardId = mocks.board1.id;
    const expectedAction = {
      type: types.SET_ACTIVE_BOARD_ID,
      payload: boardId,
    };
    expect(actions.setActiveBoardId(boardId)).toEqual(expectedAction);
  });

  it('should create an action to set an active project', () => {
    const projectId = mocks.project1.id;
    const expectedAction = {
      type: types.SET_ACTIVE_PROJECT_ID,
      payload: projectId,
    };
    expect(actions.setActiveProjectId(projectId)).toEqual(expectedAction);
  });

  it('should create an action to set board types', () => {
    const mockBoardTypes = [...mocks.boardTypes];
    const expectedAction = {
      type: types.SET_BOARD_TYPES,
      payload: mockBoardTypes,
    };
    expect(actions.setBoardTypes(mockBoardTypes)).toEqual(expectedAction);
  });

  it('should create an action to set loading', () => {
    const isLoading = true;
    const expectedAction = {
      type: types.SET_IS_LOADING,
      payload: isLoading,
    };
    expect(actions.setIsLoading(isLoading)).toEqual(expectedAction);
  });

  it('should create an action to set projects metadata', () => {
    const mockProjectsMetadata = { ...mocks.projectsMetadata };
    const expectedAction = {
      type: types.SET_PROJECTS_METADATA,
      payload: mockProjectsMetadata,
    };
    expect(actions.setProjectsMetadata(mockProjectsMetadata)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set project types', () => {
    const mockProjectTypes = [...mocks.projectTypes];
    const expectedAction = {
      type: types.SET_PROJECT_TYPES,
      payload: mockProjectTypes,
    };
    expect(actions.setProjectTypes(mockProjectTypes)).toEqual(expectedAction);
  });

  it('should create an action to update a project board', () => {
    const projectId = mocks.project1.id;
    const board = { ...mocks.board1 };
    const expectedAction = {
      type: types.UPDATE_PROJECT_BOARD,
      payload: {
        projectId,
        board,
      },
    };
    expect(actions.updateProjectBoard(projectId, board)).toEqual(
      expectedAction,
    );
  });
});

describe('dispatch actions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should dispatch the expected actions when a create project request is successful', () => {
    const mockProject = { ...mocks.project1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = '/projects';
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        ...mockProject,
      },
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.addProjectAction(mockProject)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_PROJECT,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_PROJECT_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.CREATE_PROJECT,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.ADD_PROJECT,
        payload: {
          ...mockProject,
        },
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a create project request fails', () => {
    const mockProject = { ...mocks.project1 };
    const mockAPIResponse = {
      status: true,
      message: 'Failed to create project',
    };

    const url = '/projects';
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        ...mockProject,
      },
    };

    MockAPI.onPost(url).reply(500, mockAPIResponse);

    return store.dispatch(actions.addProjectAction(mockProject)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_PROJECT,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_PROJECT_FAIL,
        error: Error('Request failed with status code 500'),
        meta: {
          previousAction: {
            type: types.CREATE_PROJECT,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch an action to clear the active board id', () => {
    store.dispatch(actions.clearActiveBoardIdAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.SET_ACTIVE_BOARD_ID,
      payload: null,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear the active project id', () => {
    store.dispatch(actions.clearActiveProjectIdAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.SET_ACTIVE_PROJECT_ID,
      payload: null,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear all projects', () => {
    store.dispatch(actions.clearProjectsAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_PROJECTS,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear the projects metadata', () => {
    store.dispatch(actions.clearProjectsMetadataAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_PROJECTS_METADATA,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch the expected actions when a create sprint request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints`;
    const mockRequest = {
      method: 'POST',
      url,
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.createSprintAction(mockProjectId, mockBoardId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.CREATE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.CREATE_SPRINT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.CREATE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a create sprint request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Failed to create sprint',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints`;
    const mockRequest = {
      method: 'POST',
      url,
    };

    MockAPI.onPost(url).reply(500, mockAPIResponse);

    return store
      .dispatch(actions.createSprintAction(mockProjectId, mockBoardId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.CREATE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.CREATE_SPRINT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.CREATE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a delete sprint request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints/${mockSprintId}`;
    const mockRequest = {
      method: 'DELETE',
      url,
    };

    MockAPI.onDelete(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.deleteSprintAction(mockProjectId, mockBoardId, mockSprintId),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: issueTypes.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[2]).toEqual({
          type: types.DELETE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.DELETE_SPRINT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.DELETE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[4]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[5]).toEqual({
          type: issueTypes.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a delete sprint request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to delete sprint',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints/${mockSprintId}`;
    const mockRequest = {
      method: 'DELETE',
      url,
    };

    MockAPI.onDelete(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.deleteSprintAction(mockProjectId, mockBoardId, mockSprintId),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: issueTypes.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[2]).toEqual({
          type: types.DELETE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.DELETE_SPRINT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.DELETE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[4]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get board types request is successful', () => {
    const mockBoardTypes = [...mocks.boardTypes];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        boardTypes: [...mockBoardTypes],
      },
    };

    const url = '/boardTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getBoardTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_BOARD_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_BOARD_TYPES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_BOARD_TYPES,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.SET_BOARD_TYPES,
        payload: [...mockBoardTypes],
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get board types request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Board types not found',
    };

    const url = '/boardTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getBoardTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_BOARD_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_BOARD_TYPES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_BOARD_TYPES,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get project request is successful', () => {
    const mockProject = { ...mocks.project1 };
    const mockProjectId = mockProject.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        project: { ...mockProject },
      },
    };

    const url = `/projects/${mockProjectId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getProjectAction(mockProjectId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECT,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECT_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_PROJECT,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.ADD_PROJECT,
        payload: mockProject,
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get project request fails', () => {
    const mockProject = { ...mocks.project1 };
    const mockProjectId = mockProject.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Project not found',
    };

    const url = `/projects/${mockProjectId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getProjectAction(mockProjectId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECT,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECT_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_PROJECT,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get project board request is successful', () => {
    const mockProject = { ...mocks.project1 };
    const mockProjectId = mockProject.id;
    const mockBoard = { ...mocks.board1 };
    const mockBoardId = mockBoard.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        board: { ...mockBoard },
      },
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.getProjectBoardAction(mockProjectId, mockBoardId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_PROJECT_BOARD,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_PROJECT_BOARD_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.GET_PROJECT_BOARD,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toEqual({
          type: types.UPDATE_PROJECT_BOARD,
          payload: {
            projectId: mockProjectId,
            board: { ...mockBoard },
          },
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get project board request fails', () => {
    const mockProject = { ...mocks.project1 };
    const mockProjectId = mockProject.id;
    const mockBoard = { ...mocks.board1 };
    const mockBoardId = mockBoard.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get project board',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store
      .dispatch(actions.getProjectBoardAction(mockProjectId, mockBoardId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_PROJECT_BOARD,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_PROJECT_BOARD_FAIL,
          error: Error('Request failed with status code 404'),
          meta: {
            previousAction: {
              type: types.GET_PROJECT_BOARD,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get projects request is successful', () => {
    const mockProjectsMetadata = { ...mocks.projectsMetadata };
    const mockPageSize = mockProjectsMetadata.pagination.pageSize;
    const mockProjects = [
      { ...mocks.project1 },
      { ...mocks.project2 },
      { ...mocks.project3 },
    ];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        projects: [...mockProjects],
        metadata: { ...mockProjectsMetadata },
      },
    };

    const url = `/projects?pageSize=${mockPageSize}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getProjectsAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECTS,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECTS_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_PROJECTS,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.ADD_PROJECTS,
        payload: [...mockProjects],
      });
      expect(storeActions[5]).toEqual({
        type: types.SET_PROJECTS_METADATA,
        payload: { ...mockProjectsMetadata },
      });
      expect(storeActions[6]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get projects request fails', () => {
    const mockProjectsMetadata = { ...mocks.projectsMetadata };
    const mockPageSize = mockProjectsMetadata.pagination.pageSize;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get projects',
    };

    const url = `/projects?pageSize=${mockPageSize}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getProjectsAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECTS,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECTS_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_PROJECTS,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get project types request is successful', () => {
    const mockProjectTypes = [...mocks.projectTypes];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        projectTypes: [...mockProjectTypes],
      },
    };

    const url = '/projectTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getProjectTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECT_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECT_TYPES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_PROJECT_TYPES,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.SET_PROJECT_TYPES,
        payload: [...mockProjectTypes],
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get project types request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get project types',
    };

    const url = '/projectTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getProjectTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PROJECT_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PROJECT_TYPES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_PROJECT_TYPES,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_LOADING,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch an action to set the active board id', () => {
    const mockBoardId = mocks.board1.id;
    store.dispatch(actions.setActiveBoardIdAction(mockBoardId));
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.SET_ACTIVE_BOARD_ID,
      payload: mockBoardId,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to set the active project id', () => {
    const mockProjectId = mocks.project1.id;
    store.dispatch(actions.setActiveProjectIdAction(mockProjectId));
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.SET_ACTIVE_PROJECT_ID,
      payload: mockProjectId,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch the expected actions when a update sprint request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockSprint = { ...mocks.sprint1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints/${mockSprintId}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        ...mockSprint,
      },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.updateSprintAction(
          mockProjectId,
          mockBoardId,
          mockSprintId,
          mockSprint,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_SPRINT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.UPDATE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a update sprint request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockBoardId = mocks.board1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockSprint = { ...mocks.sprint1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to update sprint',
    };

    const url = `/projects/${mockProjectId}/boards/${mockBoardId}/sprints/${mockSprintId}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        ...mockSprint,
      },
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.updateSprintAction(
          mockProjectId,
          mockBoardId,
          mockSprintId,
          mockSprint,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_SPRINT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.UPDATE_SPRINT,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOADING,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });
});
