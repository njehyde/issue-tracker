import { AuthAction } from 'constants/actionTypes';
import history from 'services/history';

import { showErrorAlert } from 'services/notifications';

export const setIsLoggingIn = isLoggingIn => ({
  type: AuthAction.SET_IS_LOGGING_IN,
  payload: isLoggingIn,
});

export const setIsRegisteringUser = isRegisteringUser => ({
  type: AuthAction.SET_IS_REGISTERING_USER,
  payload: isRegisteringUser,
});

export const setUser = user => ({
  type: AuthAction.SET_USER,
  payload: user,
});

export const checkAuthenticatedAction = () => dispatch => {
  return dispatch({
    type: AuthAction.CHECK_AUTHENTICATED,
    payload: {
      request: {
        method: 'GET',
        url: '/authenticated',
      },
    },
  });
};

export const loginAction = (email, password, onFail) => dispatch => {
  dispatch(setIsLoggingIn(true));

  return dispatch({
    type: AuthAction.LOGIN,
    payload: {
      request: {
        method: 'POST',
        url: `/login`,
        data: { email, password },
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${AuthAction.LOGIN_SUCCESS}`) {
      const { user } = payload;

      dispatch(setIsLoggingIn(false));
      dispatch(setUser(user));
      history.push('/projects');
    }
    if (type === `${AuthAction.LOGIN_FAIL}`) {
      showErrorAlert('Login failed');
      dispatch(setIsLoggingIn(false));
      if (onFail) {
        onFail();
      }
    }
  });
};

export const addUserAction = user => dispatch => {
  dispatch(setIsRegisteringUser(true));

  return dispatch({
    type: AuthAction.CREATE_USER,
    payload: {
      request: {
        method: 'POST',
        url: `/register`,
        data: { ...user },
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${AuthAction.CREATE_USER_SUCCESS}`) {
      const { user: savedUser } = payload;

      dispatch(setIsRegisteringUser(false));
      dispatch(setUser(savedUser));
      history.push('/');
    }
    if (type === `${AuthAction.CREATE_USER_FAIL}`) {
      showErrorAlert('Registration failed');
      dispatch(setIsRegisteringUser(false));
    }
  });
};

export const logoutAction = () => dispatch => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  dispatch(setUser(null));
};
