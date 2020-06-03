import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';
import MockAdapter from 'axios-mock-adapter';
import defaultClient from 'services/defaultClient';
import mocks from 'mocks';
import { IssueAction as types } from 'constants/actionTypes';
import * as actions from 'actions/issue';
import { initialState } from 'reducers/issue';

const MockAPI = new MockAdapter(defaultClient);
const middlewares = [
  thunk.withExtraArgument(defaultClient),
  axiosMiddleware(defaultClient),
];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  issueStore: { ...initialState },
});

describe('action creators', () => {
  it('should create an action to add an issue', () => {
    const mockIssue = { ...mocks.backlogIssue1 };
    const expectedAction = {
      type: types.ADD_ISSUE,
      payload: mockIssue,
    };
    expect(actions.addIssue(mockIssue)).toEqual(expectedAction);
  });

  it('should create an action to add multiple issue comments', () => {
    const mockIssueComments = [
      { ...mocks.issueComment1 },
      { ...mocks.issueComment2 },
      { ...mocks.issueComment3 },
    ];
    const expectedAction = {
      type: types.ADD_ISSUE_COMMENTS,
      payload: mockIssueComments,
    };
    expect(actions.addIssueComments(mockIssueComments)).toEqual(expectedAction);
  });

  it('should create an action to add multiple issues', () => {
    const mockIssues = [
      { ...mocks.backlogIssue1 },
      { ...mocks.backlogIssue2 },
      { ...mocks.backlogIssue3 },
    ];
    const expectedAction = {
      type: types.ADD_ISSUES,
      payload: mockIssues,
    };
    expect(actions.addIssues(mockIssues)).toEqual(expectedAction);
  });

  it('should create an action to add a issues metadata object for a sprint', () => {
    const mockSprintId = mocks.sprint1.id;
    const mockMetadata = { ...mocks.issuesMetadata };
    const expectedAction = {
      type: types.ADD_SPRINT_ISSUES_METADATA,
      payload: {
        sprintId: mockSprintId,
        metadata: mockMetadata,
      },
    };
    expect(actions.addSprintIssuesMetadata(mockSprintId, mockMetadata)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to clear all issue metadatas', () => {
    const expectedAction = {
      type: types.CLEAR_ALL_ISSUE_METADATAS,
    };
    expect(actions.clearAllIssueMetadatas()).toEqual(expectedAction);
  });

  it('should create an action to clear all backlog issues', () => {
    const expectedAction = {
      type: types.CLEAR_BACKLOG_ISSUES,
    };
    expect(actions.clearBacklogIssues()).toEqual(expectedAction);
  });

  it('should create an action to clear the backlog issues metadata', () => {
    const expectedAction = {
      type: types.CLEAR_BACKLOG_ISSUES_METADATA,
    };
    expect(actions.clearBacklogIssuesMetadata()).toEqual(expectedAction);
  });

  it('should create an action to clear all issue comments', () => {
    const expectedAction = {
      type: types.CLEAR_ISSUE_COMMENTS,
    };
    expect(actions.clearIssueComments()).toEqual(expectedAction);
  });

  it('should create an action to clear the issue comments metadata', () => {
    const expectedAction = {
      type: types.CLEAR_ISSUE_COMMENTS_METADATA,
    };
    expect(actions.clearIssueCommentsMetadata()).toEqual(expectedAction);
  });

  it('should create an action to clear all issues', () => {
    const expectedAction = {
      type: types.CLEAR_ISSUES,
    };
    expect(actions.clearIssues()).toEqual(expectedAction);
  });

  it('should create an action to clear the issues metadata', () => {
    const expectedAction = {
      type: types.CLEAR_ISSUES_METADATA,
    };
    expect(actions.clearIssuesMetadata()).toEqual(expectedAction);
  });

  it('should create an action to clear all sprint issues', () => {
    const mockSprintId = mocks.sprint1.id;
    const expectedAction = {
      type: types.CLEAR_SPRINT_ISSUES,
      payload: mockSprintId,
    };
    expect(actions.clearSprintIssues(mockSprintId)).toEqual(expectedAction);
  });

  it('should create an action to clear all the sprint issues metadatas', () => {
    const expectedAction = {
      type: types.CLEAR_SPRINT_ISSUES_METADATAS,
    };
    expect(actions.clearSprintIssuesMetadatas()).toEqual(expectedAction);
  });

  it('should create an action to remove an issue comment', () => {
    const mockComment = { ...mocks.issueComment1 };
    const expectedAction = {
      type: types.REMOVE_ISSUE_COMMENT,
      payload: { ...mockComment },
    };
    expect(actions.removeIssueComment(mockComment)).toEqual(expectedAction);
  });

  it('should create an action to remove a sprint issues metadata', () => {
    const mockSprintId = mocks.sprint1.id;
    const expectedAction = {
      type: types.REMOVE_SPRINT_ISSUES_METADATA,
      payload: mockSprintId,
    };
    expect(actions.removeSprintIssuesMetadata(mockSprintId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set the backlog issues metadata', () => {
    const mockMetadata = { ...mocks.issuesMetadata };
    const expectedAction = {
      type: types.SET_BACKLOG_ISSUES_METADATA,
      payload: mockMetadata,
    };
    expect(actions.setBacklogIssuesMetadata(mockMetadata)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set the is loading property', () => {
    const mockIsLoading = true;
    const expectedAction = {
      type: types.SET_IS_LOADING,
      payload: mockIsLoading,
    };
    expect(actions.setIsLoading(mockIsLoading)).toEqual(expectedAction);
  });

  it('should create an action to set issue comments metadata', () => {
    const mockIssueCommentsMetadata = { ...mocks.issueCommentsMetadata };
    const expectedAction = {
      type: types.SET_ISSUE_COMMENTS_METADATA,
      payload: mockIssueCommentsMetadata,
    };
    expect(actions.setIssueCommentsMetadata(mockIssueCommentsMetadata)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set issues metadata', () => {
    const mockIssuesMetadata = { ...mocks.issuesMetadata };
    const expectedAction = {
      type: types.SET_ISSUES_METADATA,
      payload: mockIssuesMetadata,
    };
    expect(actions.setIssuesMetadata(mockIssuesMetadata)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set issue statuses', () => {
    const mockIssueStatuses = [...mocks.issueStatuses];
    const expectedAction = {
      type: types.SET_ISSUE_STATUSES,
      payload: mockIssueStatuses,
    };
    expect(actions.setIssueStatuses(mockIssueStatuses)).toEqual(expectedAction);
  });

  it('should create an action to set issue types', () => {
    const mockIssueTypes = [...mocks.issueTypes];
    const expectedAction = {
      type: types.SET_ISSUE_TYPES,
      payload: mockIssueTypes,
    };
    expect(actions.setIssueTypes(mockIssueTypes)).toEqual(expectedAction);
  });

  it('should create an action to set priority types', () => {
    const mockPriorityTypes = [...mocks.priorityTypes];
    const expectedAction = {
      type: types.SET_PRIORITY_TYPES,
      payload: mockPriorityTypes,
    };
    expect(actions.setPriorityTypes(mockPriorityTypes)).toEqual(expectedAction);
  });

  it('should create an action to update issues', () => {
    const mockIssues = [
      { ...mocks.backlogIssue1 },
      { ...mocks.backlogIssue2 },
      { ...mocks.backlogIssue3 },
    ];
    const expectedAction = {
      type: types.UPDATE_ISSUES,
      payload: mockIssues,
    };
    expect(actions.updateIssues(mockIssues)).toEqual(expectedAction);
  });
});

describe('dispatch actions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should dispatch an action to clear all issue metadatas', () => {
    store.dispatch(actions.clearAllIssueMetadatasAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_ALL_ISSUE_METADATAS,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear all backlog issues', () => {
    store.dispatch(actions.clearBacklogIssuesAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_BACKLOG_ISSUES,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear the backlog issues metadata', () => {
    store.dispatch(actions.clearBacklogIssuesMetadataAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_BACKLOG_ISSUES_METADATA,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear all issue comments', () => {
    store.dispatch(actions.clearIssueCommentsAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_ISSUE_COMMENTS,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear the issue comments metadata', () => {
    store.dispatch(actions.clearIssueCommentsMetadataAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_ISSUE_COMMENTS_METADATA,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear all issues', () => {
    store.dispatch(actions.clearIssuesAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_ISSUES,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear the issues metadata', () => {
    store.dispatch(actions.clearIssuesMetadataAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_ISSUES_METADATA,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch an action to clear all issues for a sprint', () => {
    const mockSprintId = mocks.sprint1.id;
    store.dispatch(actions.clearSprintIssuesAction(mockSprintId));
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.CLEAR_SPRINT_ISSUES,
      payload: mockSprintId,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch the expected actions when a create issue request is successful', () => {
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockAPIResponse = {
      status: true,
      message: 'Issue created successfully',
    };

    const url = `/issues`;
    const mockRequest = {
      method: 'POST',
      url,
      data: mockIssue,
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.createIssueAction(mockIssue)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_ISSUE,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_ISSUE_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.CREATE_ISSUE,
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
        type: types.ADD_ISSUE,
        payload: { ...mockIssue },
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a create issue request fails', () => {
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issue not created',
    };

    const url = `/issues`;
    const mockRequest = {
      method: 'POST',
      url,
      data: mockIssue,
    };

    MockAPI.onPost(url).reply(500, mockAPIResponse);

    return store.dispatch(actions.createIssueAction(mockIssue)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_ISSUE,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_ISSUE_FAIL,
        error: Error('Request failed with status code 500'),
        meta: {
          previousAction: {
            type: types.CREATE_ISSUE,
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
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a create issue comment request is successful', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockIssueComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: true,
      message: 'Issue comment created successfully',
    };

    const url = `/issues/${mockIssueId}/comments`;
    const mockRequest = {
      method: 'POST',
      url,
      data: mockIssueComment,
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.createIssueCommentAction(mockIssue, mockIssueComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.CREATE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.CREATE_ISSUE_COMMENT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.CREATE_ISSUE_COMMENT,
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
          type: types.CLEAR_ISSUE_COMMENTS,
        });
        expect(storeActions[5]).toEqual({
          type: types.CLEAR_ISSUE_COMMENTS_METADATA,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a create issue comment request fails', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockIssueComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issue comment not created',
    };

    const url = `/issues/${mockIssueId}/comments`;
    const mockRequest = {
      method: 'POST',
      url,
      data: mockIssueComment,
    };

    MockAPI.onPost(url).reply(500, mockAPIResponse);

    return store
      .dispatch(actions.createIssueCommentAction(mockIssue, mockIssueComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.CREATE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.CREATE_ISSUE_COMMENT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.CREATE_ISSUE_COMMENT,
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

  it('should dispatch the expected actions when a delete issue request is successful', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockIssueCommentId = mocks.issueComment1.id;
    const mockIssueComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: true,
      message: 'Issue comment deleted successfully',
    };

    const url = `/issues/${mockIssueId}/comments/${mockIssueCommentId}`;
    const mockRequest = {
      method: 'DELETE',
      url,
    };

    MockAPI.onDelete(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.deleteIssueCommentAction(mockIssue, mockIssueComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.DELETE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.DELETE_ISSUE_COMMENT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.DELETE_ISSUE_COMMENT,
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
          type: types.REMOVE_ISSUE_COMMENT,
          payload: { ...mockIssueComment },
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a delete issue request fails', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockIssueCommentId = mocks.issueComment1.id;
    const mockIssueComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issue comment not deleted',
    };

    const url = `/issues/${mockIssueId}/comments/${mockIssueCommentId}`;
    const mockRequest = {
      method: 'DELETE',
      url,
    };

    MockAPI.onDelete(url).reply(500, mockAPIResponse);

    return store
      .dispatch(actions.deleteIssueCommentAction(mockIssue, mockIssueComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.DELETE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.DELETE_ISSUE_COMMENT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.DELETE_ISSUE_COMMENT,
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

  it('should dispatch the expected actions when a get backlog issues request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssues = [
      { ...mocks.backlogIssue1 },
      { ...mocks.backlogIssue2 },
      { ...mocks.backlogIssue3 },
    ];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issues: [...mockIssues],
        metadata: { ...mocks.issuesMetadata },
      },
    };

    const url = `/projects/${mockProjectId}/backlog/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.getBacklogIssuesAction(mockProjectId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_BACKLOG_ISSUES,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_BACKLOG_ISSUES_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.GET_BACKLOG_ISSUES,
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
          type: types.ADD_ISSUES,
          payload: [...mockIssues],
        });
        expect(storeActions[5]).toEqual({
          type: types.SET_BACKLOG_ISSUES_METADATA,
          payload: { ...mocks.issuesMetadata },
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get backlog issues request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issues not found',
    };

    const url = `/projects/${mockProjectId}/backlog/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store
      .dispatch(actions.getBacklogIssuesAction(mockProjectId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_BACKLOG_ISSUES,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_BACKLOG_ISSUES_FAIL,
          error: Error('Request failed with status code 404'),
          meta: {
            previousAction: {
              type: types.GET_BACKLOG_ISSUES,
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

  it('should dispatch the expected actions when a get issues request is successful', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issue: { ...mockIssue },
      },
    };

    const url = `/issues/${mockIssueId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getIssueAction(mockIssueId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_ISSUE,
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
        type: types.ADD_ISSUE,
        payload: { ...mockIssue },
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get issues request fails', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issue comment not created',
    };

    const url = `/issues/${mockIssueId}`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getIssueAction(mockIssueId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_ISSUE,
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
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get issue comments request is successful', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockIssueComments = [
      { ...mocks.issueComment1 },
      { ...mocks.issueComment2 },
      { ...mocks.issueComment3 },
    ];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issueComments: [...mockIssueComments],
        metadata: { ...mocks.issueCommentsMetadata },
      },
    };

    const url = `/issues/${mockIssueId}/comments?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.getIssueCommentsAction(mockIssueId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_ISSUE_COMMENTS,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_ISSUE_COMMENTS_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.GET_ISSUE_COMMENTS,
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
          type: types.ADD_ISSUE_COMMENTS,
          payload: [...mockIssueComments],
        });
        expect(storeActions[5]).toEqual({
          type: types.SET_ISSUE_COMMENTS_METADATA,
          payload: { ...mocks.issueCommentsMetadata },
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get issue comments request fails', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issue comments not found',
    };

    const url = `/issues/${mockIssueId}/comments?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store
      .dispatch(actions.getIssueCommentsAction(mockIssueId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_ISSUE_COMMENTS,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_ISSUE_COMMENTS_FAIL,
          error: Error('Request failed with status code 404'),
          meta: {
            previousAction: {
              type: types.GET_ISSUE_COMMENTS,
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

  it('should dispatch the expected actions when a get issues request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssues = [
      { ...mocks.backlogIssue1 },
      { ...mocks.backlogIssue2 },
      { ...mocks.backlogIssue3 },
      { ...mocks.sprintIssue1 },
      { ...mocks.sprintIssue2 },
      { ...mocks.sprintIssue3 },
    ];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issues: [...mockIssues],
        metadata: { ...mocks.issuesMetadata },
      },
    };

    const url = `/projects/${mockProjectId}/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getIssuesAction(mockProjectId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_ISSUES,
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
        type: types.ADD_ISSUES,
        payload: [...mockIssues],
      });
      expect(storeActions[5]).toEqual({
        type: types.SET_ISSUES_METADATA,
        payload: { ...mocks.issuesMetadata },
      });
      expect(storeActions[6]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get issues request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issues not found',
    };

    const url = `/projects/${mockProjectId}/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getIssuesAction(mockProjectId)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_ISSUES,
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

  it('should dispatch the expected actions when a get issue statuses request is successful', () => {
    const mockIssueStatuses = [...mocks.issueStatuses];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issueStatuses: [...mockIssueStatuses],
      },
    };

    const url = '/issueStatuses';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getIssueStatusesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE_STATUSES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_STATUSES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_ISSUE_STATUSES,
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
        type: types.SET_ISSUE_STATUSES,
        payload: [...mockIssueStatuses],
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get issue statuses request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get issue statuses',
    };

    const url = '/issueStatuses';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getIssueStatusesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE_STATUSES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_STATUSES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_ISSUE_STATUSES,
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

  it('should dispatch the expected actions when a get issue types request is successful', () => {
    const mockIssueTypes = [...mocks.issueTypes];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issueTypes: [...mockIssueTypes],
      },
    };

    const url = '/issueTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getIssueTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_TYPES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_ISSUE_TYPES,
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
        type: types.SET_ISSUE_TYPES,
        payload: [...mockIssueTypes],
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get issue types request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get issue types',
    };

    const url = '/issueTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getIssueTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_ISSUE_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_ISSUE_TYPES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_ISSUE_TYPES,
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

  it('should dispatch the expected actions when a get priority types request is successful', () => {
    const mockPriorityTypes = [...mocks.priorityTypes];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        priorityTypes: [...mockPriorityTypes],
      },
    };

    const url = '/priorityTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.getPriorityTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PRIORITY_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PRIORITY_TYPES_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.GET_PRIORITY_TYPES,
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
        type: types.SET_PRIORITY_TYPES,
        payload: [...mockPriorityTypes],
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a get priority types request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to get priority types',
    };

    const url = '/priorityTypes';
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.getPriorityTypesAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_LOADING,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.GET_PRIORITY_TYPES,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.GET_PRIORITY_TYPES_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.GET_PRIORITY_TYPES,
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

  it('should dispatch the expected actions when a get sprint issues request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssues = [
      { ...mocks.sprintIssue1 },
      { ...mocks.sprintIssue2 },
      { ...mocks.sprintIssue3 },
    ];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        issues: [...mockIssues],
        metadata: { ...mocks.issuesMetadata },
      },
    };

    const url = `/projects/${mockProjectId}/sprints/${mockSprintId}/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.getSprintIssuesAction(mockProjectId, mockSprintId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_SPRINT_ISSUES,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_SPRINT_ISSUES_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.GET_SPRINT_ISSUES,
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
          type: types.ADD_ISSUES,
          payload: [...mockIssues],
        });
        expect(storeActions[5]).toEqual({
          type: types.ADD_SPRINT_ISSUES_METADATA,
          payload: {
            sprintId: mockSprintId,
            metadata: { ...mocks.issuesMetadata },
          },
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a get sprint issues request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issues not found',
    };

    const url = `/projects/${mockProjectId}/sprints/${mockSprintId}/issues?pageSize=100`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store
      .dispatch(actions.getSprintIssuesAction(mockProjectId, mockSprintId))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.GET_SPRINT_ISSUES,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.GET_SPRINT_ISSUES_FAIL,
          error: Error('Request failed with status code 404'),
          meta: {
            previousAction: {
              type: types.GET_SPRINT_ISSUES,
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

  it('should dispatch an action to remove a sprint issue metadata', () => {
    const mockSprintId = mocks.sprint1.id;
    store.dispatch(actions.removeSprintIssuesMetadataAction(mockSprintId));
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.REMOVE_SPRINT_ISSUES_METADATA,
      payload: mockSprintId,
    });
    expect(storeActions[1]).toBeUndefined();
  });

  it('should dispatch the expected actions when a send sprint issue to bottom of backlog request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/bottom`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToBottomOfBacklogAction(
          mockProjectId,
          mockIssueId,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[5]).toEqual({
          type: types.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send backlog issue to bottom of backlog request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/bottom`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToBottomOfBacklogAction(mockProjectId, mockIssueId),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send issue to bottom of backlog request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to send issue to bottom of backlog',
    };

    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/bottom`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToBottomOfBacklogAction(
          mockProjectId,
          mockIssueId,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
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

  it('should dispatch the expected actions when a send backlog issue to sprint request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockFromSprintId = mocks.sprint2.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockStatus = mocks.issueStatuses[0];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/sprints/${mockSprintId}/issues/${mockIssueId}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        status: mockStatus,
      },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToSprintAction(
          mockProjectId,
          mockSprintId,
          mockIssueId,
          mockFromSprintId,
          mockStatus,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_SPRINT,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[5]).toEqual({
          type: types.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[6]).toEqual({
          type: types.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockFromSprintId,
        });
        expect(storeActions[7]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send sprint issue to sprint request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockStatus = mocks.issueStatuses[0];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/sprints/${mockSprintId}/issues/${mockIssueId}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        status: mockStatus,
      },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToSprintAction(
          mockProjectId,
          mockSprintId,
          mockIssueId,
          null,
          mockStatus,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_SPRINT,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[5]).toEqual({
          type: types.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send issue to sprint request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockFromSprintId = mocks.sprint2.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockStatus = mocks.issueStatuses[0];
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to send issue to sprint',
    };

    const url = `/projects/${mockProjectId}/sprints/${mockSprintId}/issues/${mockIssueId}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        status: mockStatus,
      },
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToSprintAction(
          mockProjectId,
          mockSprintId,
          mockIssueId,
          mockFromSprintId,
          mockStatus,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_SPRINT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_SPRINT,
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

  it('should dispatch the expected actions when a send sprint issue to top of backlog request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/top`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToTopOfBacklogAction(
          mockProjectId,
          mockIssueId,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[5]).toEqual({
          type: types.REMOVE_SPRINT_ISSUES_METADATA,
          payload: mockSprintId,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send backlog issue to top of backlog request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/top`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToTopOfBacklogAction(mockProjectId, mockIssueId),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
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
          type: types.CLEAR_BACKLOG_ISSUES_METADATA,
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a send issue to top of backlog request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockSprintId = mocks.sprint1.id;
    const mockIssueId = mocks.backlogIssue1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Issues not found',
    };
    const url = `/projects/${mockProjectId}/backlog/issues/${mockIssueId}/top`;
    const mockRequest = {
      method: 'PUT',
      url,
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.sendIssueToTopOfBacklogAction(
          mockProjectId,
          mockIssueId,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.SEND_ISSUE_TO_TOP_OF_BACKLOG,
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
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a update issue request is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/issues/${mockIssue.id}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: { ...mockIssue },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.updateIssueAction(mockProjectId, mockIssue))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE,
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

  it('should dispatch the expected actions when a update issue request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssue = { ...mocks.backlogIssue1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to update issue',
    };

    const url = `/projects/${mockProjectId}/issues/${mockIssue.id}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: { ...mockIssue },
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(actions.updateIssueAction(mockProjectId, mockIssue))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE,
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

  it('should dispatch the expected actions when a update issue comment request is successful', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/issues/${mockIssueId}/comments/${mockComment.id}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: { ...mockComment },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(actions.updateIssueCommentAction(mockIssueId, mockComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_COMMENT_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE_COMMENT,
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
          type: types.CLEAR_ISSUE_COMMENTS,
        });
        expect(storeActions[5]).toEqual({
          type: types.CLEAR_ISSUE_COMMENTS_METADATA,
        });
        expect(storeActions[6]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a update issue comment request fails', () => {
    const mockIssueId = mocks.backlogIssue1.id;
    const mockComment = { ...mocks.issueComment1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to update issue comment',
    };

    const url = `/issues/${mockIssueId}/comments/${mockComment.id}`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: { ...mockComment },
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(actions.updateIssueCommentAction(mockIssueId, mockComment))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE_COMMENT,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_COMMENT_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE_COMMENT,
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

  it('should dispatch the expected actions when a update issue ordinals request, with a sprint id, is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssueOrdinals = [...mocks.issueOrdinals];
    const mockSprintId = mocks.sprint1.id;
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/issue/ordinals`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        issueOrdinals: [...mockIssueOrdinals],
      },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.updateIssueOrdinalsAction(
          mockProjectId,
          mockIssueOrdinals,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE_ORDINALS,
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
          type: types.CLEAR_SPRINT_ISSUES_METADATAS,
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a update issue ordinals request, without a sprint id, is successful', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssueOrdinals = [...mocks.issueOrdinals];
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/projects/${mockProjectId}/issue/ordinals`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        issueOrdinals: [...mockIssueOrdinals],
      },
    };

    MockAPI.onPut(url).reply(200, mockAPIResponse);

    return store
      .dispatch(
        actions.updateIssueOrdinalsAction(mockProjectId, mockIssueOrdinals),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE_ORDINALS,
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
          type: types.CLEAR_BACKLOG_ISSUES,
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a update issue ordinals request fails', () => {
    const mockProjectId = mocks.project1.id;
    const mockIssueOrdinals = [...mocks.issueOrdinals];
    const mockSprintId = mocks.sprint1.id;
    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Failed to update issue ordinals',
    };

    const url = `/projects/${mockProjectId}/issue/ordinals`;
    const mockRequest = {
      method: 'PUT',
      url,
      data: {
        issueOrdinals: [...mockIssueOrdinals],
      },
    };

    MockAPI.onPut(url).reply(500, mockAPIResponse);

    return store
      .dispatch(
        actions.updateIssueOrdinalsAction(
          mockProjectId,
          mockIssueOrdinals,
          mockSprintId,
        ),
      )
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOADING,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.UPDATE_ISSUE_ORDINALS_FAIL,
          error: Error('Request failed with status code 500'),
          meta: {
            previousAction: {
              type: types.UPDATE_ISSUE_ORDINALS,
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

  it('should dispatch the expected actions when a update issues request is successful', () => {
    const mockIssues = [
      { ...mocks.backlogIssue1 },
      { ...mocks.backlogIssue2 },
      { ...mocks.backlogIssue3 },
    ];
    store.dispatch(actions.updateIssues(mockIssues));
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.UPDATE_ISSUES,
      payload: [...mockIssues],
    });
    expect(storeActions[1]).toBeUndefined();
  });
});
