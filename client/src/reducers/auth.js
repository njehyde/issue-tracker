import mapActionToReducer from 'redux-action-reducer-mapper';
import { AuthAction } from 'constants/actionTypes';

export const initialState = {
  isLoggingIn: false,
  isRegisteringUser: false,
  user: null,
};

const setIsLoggingIn = (state, action) => ({
  ...state,
  isLoggingIn: action.payload,
});

const setIsRegisteringUser = (state, action) => ({
  ...state,
  isRegisteringUser: action.payload,
});

const setUser = (state, action) => ({
  ...state,
  user: action.payload,
});

const reducer = mapActionToReducer({
  default: initialState,
  [AuthAction.SET_IS_LOGGING_IN]: setIsLoggingIn,
  [AuthAction.SET_IS_REGISTERING_USER]: setIsRegisteringUser,
  [AuthAction.SET_USER]: setUser,
});

export default reducer;
