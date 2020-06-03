import reducer, { initialState } from 'reducers/project';
import { ProjectAction as types } from 'constants/actionTypes';
import { defaultProjectMetadata } from 'constants/project';
import mocks from 'mocks';

describe('project reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      isLoading: false,
      activeProjectId: null,
      activeBoardId: null,
      boardTypes: [],
      projects: [],
      projectsMetadata: { ...defaultProjectMetadata },
      projectTypes: [],
    });
  });

  it('should handle ADD_PROJECT (insert)', () => {
    const mockState = { ...initialState, projects: [mocks.project1] };
    const mockAction = {
      type: types.ADD_PROJECT,
      payload: mocks.project2,
    };
    const expectedState = {
      ...initialState,
      projects: [mocks.project1, mocks.project2],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_PROJECT (upsert)', () => {
    const mockState = {
      ...initialState,
      projects: [mocks.project1, mocks.project2],
    };
    const updatedProject1 = { ...mocks.project1, name: 'Project 1 (updated)' };
    const mockAction = {
      type: types.ADD_PROJECT,
      payload: updatedProject1,
    };
    const expectedState = {
      ...initialState,
      projects: [updatedProject1, mocks.project2],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_PROJECTS (insert)', () => {
    const mockState = { ...initialState, projects: [mocks.project1] };
    const mockAction = {
      type: types.ADD_PROJECTS,
      payload: [mocks.project2, mocks.project3],
    };
    const expectedState = {
      ...initialState,
      projects: [mocks.project1, mocks.project2, mocks.project3],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_PROJECTS (upsert)', () => {
    const mockState = {
      ...initialState,
      projects: [mocks.project1, mocks.project2],
    };
    const updatedProject1 = { ...mocks.project1, name: 'Project 1 (updated)' };
    const mockAction = {
      type: types.ADD_PROJECTS,
      payload: [updatedProject1, mocks.project3],
    };
    const expectedState = {
      ...initialState,
      projects: [updatedProject1, mocks.project2, mocks.project3],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_PROJECTS_METADATA', () => {
    const mockState = {
      ...initialState,
      projectsMetadata: { ...mocks.projectsMetadata },
    };
    const mockAction = {
      type: types.CLEAR_PROJECTS_METADATA,
    };
    const expectedState = {
      ...initialState,
      projectsMetadata: { ...defaultProjectMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_PROJECTS', () => {
    const mockState = {
      ...initialState,
      projects: [mocks.projectMock1, mocks.projectMock2, mocks.projectMock3],
    };
    const mockAction = {
      type: types.CLEAR_PROJECTS,
      payload: true,
    };
    const expectedState = {
      ...initialState,
      projects: [],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_ACTIVE_BOARD_ID', () => {
    const mockState = { ...initialState };
    const mockBoardId = mocks.board1.id;
    const mockAction = {
      type: types.SET_ACTIVE_BOARD_ID,
      payload: mockBoardId,
    };
    const expectedState = {
      ...initialState,
      activeBoardId: mockBoardId,
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_ACTIVE_PROJECT_ID', () => {
    const mockState = { ...initialState };
    const mockProjectId = mocks.project1.id;
    const mockAction = {
      type: types.SET_ACTIVE_PROJECT_ID,
      payload: mockProjectId,
    };
    const expectedState = {
      ...initialState,
      activeProjectId: mockProjectId,
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_BOARD_TYPES', () => {
    const mockBoardTypes = [...mocks.boardTypes];
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_BOARD_TYPES,
      payload: [...mockBoardTypes],
    };
    const expectedState = {
      ...initialState,
      boardTypes: [...mockBoardTypes],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_IS_LOADING', () => {
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_IS_LOADING,
      payload: true,
    };
    const expectedState = {
      ...initialState,
      isLoading: true,
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_PROJECT_TYPES', () => {
    const mockProjectTypes = [...mocks.projectTypes];
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_PROJECT_TYPES,
      payload: [...mockProjectTypes],
    };
    const expectedState = {
      ...initialState,
      projectTypes: [...mockProjectTypes],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_PROJECTS_METADATA', () => {
    const mockProjectsMetadata = { ...mocks.projectsMetadata };
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_PROJECTS_METADATA,
      payload: { ...mockProjectsMetadata },
    };
    const expectedState = {
      ...initialState,
      projectsMetadata: { ...mockProjectsMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });
});
