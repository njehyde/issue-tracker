import reducer, { initialState } from 'reducers/auth';
import { AuthAction as types } from 'constants/actionTypes';
import mocks from 'mocks';

describe('auth reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoggingIn: false,
      isRegisteringUser: false,
      user: null,
    });
  });

  it('should handle SET_IS_LOGGING_IN', () => {
    const mockIsLoggingIn = true;
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_IS_LOGGING_IN,
      payload: mockIsLoggingIn,
    };
    const expectedState = {
      ...initialState,
      isLoggingIn: mockIsLoggingIn,
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_IS_REGISTERING_USER', () => {
    const mockIsRegisteringUser = true;
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_IS_REGISTERING_USER,
      payload: mockIsRegisteringUser,
    };
    const expectedState = {
      ...initialState,
      isRegisteringUser: mockIsRegisteringUser,
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_USER', () => {
    const mockUser = { ...mocks.user1 };
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_USER,
      payload: { ...mockUser },
    };
    const expectedState = {
      ...initialState,
      user: { ...mockUser },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });
});
