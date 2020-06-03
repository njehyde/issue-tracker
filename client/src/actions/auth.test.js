import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';
import MockAdapter from 'axios-mock-adapter';
import defaultClient from 'services/defaultClient';
import mocks from 'mocks';

import { AuthAction as types } from 'constants/actionTypes';
import * as actions from 'actions/auth';
import { initialState } from 'reducers/auth';

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
  it('should create an action to set the is logging in property', () => {
    const mockIsLoggingIn = true;
    const expectedAction = {
      type: types.SET_IS_LOGGING_IN,
      payload: mockIsLoggingIn,
    };
    expect(actions.setIsLoggingIn(mockIsLoggingIn)).toEqual(expectedAction);
  });

  it('should create an action to set the is registering user property', () => {
    const mockIsRegisteringUser = true;
    const expectedAction = {
      type: types.SET_IS_REGISTERING_USER,
      payload: mockIsRegisteringUser,
    };
    expect(actions.setIsRegisteringUser(mockIsRegisteringUser)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set the user', () => {
    const mockUser = { ...mocks.user1 };
    const expectedAction = {
      type: types.SET_USER,
      payload: { ...mockUser },
    };
    expect(actions.setUser(mockUser)).toEqual(expectedAction);
  });
});

describe('dispatch actions', () => {
  beforeEach(() => {
    store.clearActions();
  });

  it('should dispatch the expected actions when a check authentication request is successful', () => {
    const mockAPIResponse = {
      status: true,
      message: 'Success',
    };

    const url = `/authenticated`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(200, mockAPIResponse);

    return store.dispatch(actions.checkAuthenticatedAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.CHECK_AUTHENTICATED,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[1]).toEqual({
        type: types.CHECK_AUTHENTICATED_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.CHECK_AUTHENTICATED,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[2]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a check authentication request fails', () => {
    const mockAPIResponse = {
      status: false,
      message: 'Failed to authenticate',
    };

    const url = `/authenticated`;
    const mockRequest = {
      method: 'GET',
      url,
    };

    MockAPI.onGet(url).reply(404, mockAPIResponse);

    return store.dispatch(actions.checkAuthenticatedAction()).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.CHECK_AUTHENTICATED,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[1]).toEqual({
        type: types.CHECK_AUTHENTICATED_FAIL,
        error: Error('Request failed with status code 404'),
        meta: {
          previousAction: {
            type: types.CHECK_AUTHENTICATED,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[2]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a login request is successful', () => {
    const mockEmail = 'test@test.com';
    const mockPassword = 'password';
    const mockUser = { ...mocks.user1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        user: { ...mockUser },
      },
    };
    const mockHeaders = {
      authorization: 'Bearer XXX',
      'refresh-token': 'XXX',
    };

    const url = `/login`;
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        email: mockEmail,
        password: mockPassword,
      },
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse, mockHeaders);

    return store
      .dispatch(actions.loginAction(mockEmail, mockPassword))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOGGING_IN,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.LOGIN,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.LOGIN_SUCCESS,
          payload: mockAPIResponse.result,
          meta: {
            previousAction: {
              type: types.LOGIN,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOGGING_IN,
          payload: false,
        });
        expect(storeActions[4]).toEqual({
          type: types.SET_USER,
          payload: { ...mockUser },
        });
        expect(storeActions[5]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a login request fails', () => {
    const mockEmail = 'test@test.com';
    const mockPassword = 'password';

    const mockAPIResponse = {
      status: false,
      message: 'Failed',
      error: 'Invalid login credentials',
    };

    const url = `/login`;
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        email: mockEmail,
        password: mockPassword,
      },
    };

    MockAPI.onPost(url).reply(404, mockAPIResponse);

    return store
      .dispatch(actions.loginAction(mockEmail, mockPassword))
      .then(() => {
        const storeActions = store.getActions();
        expect(storeActions[0]).toEqual({
          type: types.SET_IS_LOGGING_IN,
          payload: true,
        });
        expect(storeActions[1]).toEqual({
          type: types.LOGIN,
          payload: {
            request: mockRequest,
          },
        });
        expect(storeActions[2]).toEqual({
          type: types.LOGIN_FAIL,
          error: Error('Request failed with status code 404'),
          meta: {
            previousAction: {
              type: types.LOGIN,
              payload: {
                request: mockRequest,
              },
            },
          },
        });
        expect(storeActions[3]).toEqual({
          type: types.SET_IS_LOGGING_IN,
          payload: false,
        });
        expect(storeActions[4]).toBeUndefined();
      });
  });

  it('should dispatch the expected actions when a add user request is successful', () => {
    const mockUser = { ...mocks.user1 };
    const mockAPIResponse = {
      status: true,
      message: 'Success',
      result: {
        user: { ...mockUser },
      },
    };
    const mockHeaders = {
      authorization: 'Bearer XXX',
      'refresh-token': 'XXX',
    };

    const url = `/register`;
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        ...mockUser,
      },
    };

    MockAPI.onPost(url).reply(200, mockAPIResponse, mockHeaders);

    return store.dispatch(actions.addUserAction(mockUser)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_REGISTERING_USER,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_USER,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_USER_SUCCESS,
        payload: mockAPIResponse.result,
        meta: {
          previousAction: {
            type: types.CREATE_USER,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_REGISTERING_USER,
        payload: false,
      });
      expect(storeActions[4]).toEqual({
        type: types.SET_USER,
        payload: { ...mockUser },
      });
      expect(storeActions[5]).toBeUndefined();
    });
  });

  it('should dispatch the expected actions when a add user request fails', () => {
    const mockUser = { ...mocks.user1 };
    const mockAPIResponse = {
      status: false,
      message: 'Failure',
      error: 'Failed to add user',
    };
    const mockHeaders = {
      authorization: 'Bearer XXX',
      'refresh-token': 'XXX',
    };

    const url = `/register`;
    const mockRequest = {
      method: 'POST',
      url,
      data: {
        ...mockUser,
      },
    };

    MockAPI.onPost(url).reply(500, mockAPIResponse, mockHeaders);

    return store.dispatch(actions.addUserAction(mockUser)).then(() => {
      const storeActions = store.getActions();
      expect(storeActions[0]).toEqual({
        type: types.SET_IS_REGISTERING_USER,
        payload: true,
      });
      expect(storeActions[1]).toEqual({
        type: types.CREATE_USER,
        payload: {
          request: mockRequest,
        },
      });
      expect(storeActions[2]).toEqual({
        type: types.CREATE_USER_FAIL,
        error: Error('Request failed with status code 500'),
        meta: {
          previousAction: {
            type: types.CREATE_USER,
            payload: {
              request: mockRequest,
            },
          },
        },
      });
      expect(storeActions[3]).toEqual({
        type: types.SET_IS_REGISTERING_USER,
        payload: false,
      });
      expect(storeActions[4]).toBeUndefined();
    });
  });

  it('should dispatch an action to remove the set user', () => {
    store.dispatch(actions.logoutAction());
    const storeActions = store.getActions();
    expect(storeActions[0]).toEqual({
      type: types.SET_USER,
      payload: null,
    });
    expect(storeActions[1]).toBeUndefined();
  });
});
