import reducer, { initialState } from 'reducers/issue';
import { IssueAction as types } from 'constants/actionTypes';
import {
  defaultIssueMetadata,
  defaultIssueCommentMetadata,
} from 'constants/issue';
import mocks from 'mocks';

describe('issue reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      backlogIssuesMetadata: { ...defaultIssueMetadata },
      isLoading: false,
      issueComments: [],
      issueCommentsMetadata: { ...defaultIssueCommentMetadata },
      issues: [],
      issuesMetadata: { ...defaultIssueMetadata },
      issueStatuses: [],
      issueTypes: [],
      priorityTypes: [],
      sprintIssuesMetadatas: [],
    });
  });

  it('should handle ADD_ISSUE_COMMENTS', () => {
    const mockState = { ...initialState, issueComments: [] };
    const mockAction = {
      type: types.ADD_ISSUE_COMMENTS,
      payload: [
        { ...mocks.issueComment1 },
        { ...mocks.issueComment2 },
        { ...mocks.issueComment3 },
      ],
    };
    const expectedState = {
      ...initialState,
      issueComments: [
        { ...mocks.issueComment1 },
        { ...mocks.issueComment2 },
        { ...mocks.issueComment3 },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUE_COMMENTS (insert)', () => {
    const mockState = {
      ...initialState,
      issueComments: [{ ...mocks.issueComment1 }],
    };
    const mockAction = {
      type: types.ADD_ISSUE_COMMENTS,
      payload: [{ ...mocks.issueComment2 }, { ...mocks.issueComment3 }],
    };
    const expectedState = {
      ...initialState,
      issueComments: [
        { ...mocks.issueComment1 },
        { ...mocks.issueComment2 },
        { ...mocks.issueComment3 },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUE_COMMENTS (upsert)', () => {
    const mockState = {
      ...initialState,
      issueComments: [{ ...mocks.issueComment1 }, { ...mocks.issueComment2 }],
    };
    const updatedIssueComment1 = {
      ...mocks.issueComment1,
      text: 'Issue comment 1 (updated)',
    };
    const mockAction = {
      type: types.ADD_ISSUE_COMMENTS,
      payload: [updatedIssueComment1],
    };
    const expectedState = {
      ...initialState,
      issueComments: [{ ...updatedIssueComment1 }, { ...mocks.issueComment2 }],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUE (insert)', () => {
    const mockState = { ...initialState, issues: [mocks.backlogIssue1] };
    const mockAction = {
      type: types.ADD_ISSUE,
      payload: mocks.backlogIssue2,
    };
    const expectedState = {
      ...initialState,
      issues: [mocks.backlogIssue1, mocks.backlogIssue2],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUE (upsert)', () => {
    const mockState = {
      ...initialState,
      issues: [mocks.backlogIssue1, mocks.backlogIssue2],
    };
    const updatedIssue1 = {
      ...mocks.backlogIssue1,
      summary: 'Issue 1 (updated)',
    };
    const mockAction = {
      type: types.ADD_ISSUE,
      payload: updatedIssue1,
    };
    const expectedState = {
      ...initialState,
      issues: [updatedIssue1, mocks.backlogIssue2],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUES (insert)', () => {
    const mockState = { ...initialState, issues: [mocks.backlogIssue1] };
    const mockAction = {
      type: types.ADD_ISSUES,
      payload: [mocks.backlogIssue2, mocks.backlogIssue3],
    };
    const expectedState = {
      ...initialState,
      issues: [mocks.backlogIssue1, mocks.backlogIssue2, mocks.backlogIssue3],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_ISSUES (upsert)', () => {
    const mockState = {
      ...initialState,
      issues: [mocks.backlogIssue1, mocks.backlogIssue2],
    };
    const updatedIssue1 = {
      ...mocks.backlogIssue1,
      summary: 'Issue 1 (updated)',
    };
    const mockAction = {
      type: types.ADD_ISSUES,
      payload: [updatedIssue1, mocks.backlogIssue3],
    };
    const expectedState = {
      ...initialState,
      issues: [updatedIssue1, mocks.backlogIssue2, mocks.backlogIssue3],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_SPRINT_ISSUES_METADATA (insert)', () => {
    const mockState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    const mockAction = {
      type: types.ADD_SPRINT_ISSUES_METADATA,
      payload: {
        sprintId: mocks.sprint3.id,
        metadata: { ...mocks.issuesMetadata },
      },
    };
    const expectedState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint3.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle ADD_SPRINT_ISSUES_METADATA (upsert)', () => {
    const mockState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint3.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    const updatedSprintMetadata = { ...mocks.issuesMetadata, count: 10 };
    const mockAction = {
      type: types.ADD_SPRINT_ISSUES_METADATA,
      payload: {
        sprintId: mocks.sprint1.id,
        metadata: { ...updatedSprintMetadata },
      },
    };
    const expectedState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...updatedSprintMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint3.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_ALL_ISSUE_METADATAS', () => {
    const mockState = {
      ...initialState,
      issuesMetadata: { ...mocks.issuesMetadata },
      backlogIssuesMetadata: { ...mocks.issuesMetadata },
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    const mockAction = {
      type: types.CLEAR_ALL_ISSUE_METADATAS,
    };
    const expectedState = {
      ...initialState,
      issuesMetadata: { ...defaultIssueMetadata },
      backlogIssuesMetadata: { ...defaultIssueMetadata },
      sprintIssuesMetadatas: [],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_BACKLOG_ISSUES_METADATA', () => {
    const mockState = {
      ...initialState,
      backlogIssuesMetadata: { ...mocks.issuesMetadata },
    };
    const mockAction = {
      type: types.CLEAR_BACKLOG_ISSUES_METADATA,
    };
    const expectedState = {
      ...initialState,
      backlogIssuesMetadata: { ...defaultIssueMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_BACKLOG_ISSUES', () => {
    const mockState = {
      ...initialState,
      issues: [
        { ...mocks.sprintIssue1 },
        { ...mocks.backlogIssue1 },
        { ...mocks.sprintIssue2 },
        { ...mocks.backlogIssue2 },
        { ...mocks.sprintIssue3 },
        { ...mocks.backlogIssue3 },
      ],
    };
    const mockAction = {
      type: types.CLEAR_BACKLOG_ISSUES,
    };
    const expectedState = {
      ...initialState,
      issues: [
        { ...mocks.sprintIssue1 },
        { ...mocks.sprintIssue2 },
        { ...mocks.sprintIssue3 },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_ISSUE_COMMENTS_METADATA', () => {
    const mockState = {
      ...initialState,
      issueCommentsMetadata: { ...mocks.issueCommentsMetadata },
    };
    const mockAction = {
      type: types.CLEAR_ISSUE_COMMENTS_METADATA,
    };
    const expectedState = {
      ...initialState,
      issueCommentsMetadata: { ...defaultIssueCommentMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_ISSUE_COMMENTS', () => {
    const mockState = {
      ...initialState,
      issueComments: [
        { ...mocks.issueComment1 },
        { ...mocks.issueComment2 },
        { ...mocks.issueComment3 },
      ],
    };
    const mockAction = {
      type: types.CLEAR_ISSUE_COMMENTS,
    };
    const expectedState = {
      ...initialState,
      issueComments: [],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_ISSUES_METADATA', () => {
    const mockState = {
      ...initialState,
      issuesMetadata: { ...mocks.issuesMetadata },
    };
    const mockAction = {
      type: types.CLEAR_ISSUES_METADATA,
    };
    const expectedState = {
      ...initialState,
      issuesMetadata: { ...defaultIssueMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_ISSUES', () => {
    const mockState = {
      ...initialState,
      issues: [
        { ...mocks.backlogIssue1 },
        { ...mocks.backlogIssue2 },
        { ...mocks.backlogIssue3 },
      ],
    };
    const mockAction = {
      type: types.CLEAR_ISSUES,
    };
    const expectedState = {
      ...initialState,
      issues: [],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_SPRINT_ISSUES_METADATAS', () => {
    const mockState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    const mockAction = {
      type: types.CLEAR_SPRINT_ISSUES_METADATAS,
    };
    const expectedState = {
      ...initialState,
      sprintIssuesMetadatas: [],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle CLEAR_SPRINT_ISSUES', () => {
    const mockSprintId = mocks.sprint1.id;
    const mockState = {
      ...initialState,
      issues: [
        { ...mocks.sprintIssue1, sprintId: mockSprintId },
        { ...mocks.backlogIssue1 },
        { ...mocks.sprintIssue2, sprintId: mockSprintId },
        { ...mocks.backlogIssue2 },
        { ...mocks.sprintIssue3, sprintId: mockSprintId },
        { ...mocks.backlogIssue3 },
      ],
    };
    const mockAction = {
      type: types.CLEAR_SPRINT_ISSUES,
      payload: mockSprintId,
    };
    const expectedState = {
      ...initialState,
      issues: [
        { ...mocks.backlogIssue1 },
        { ...mocks.backlogIssue2 },
        { ...mocks.backlogIssue3 },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle REMOVE_ISSUE_COMMENT', () => {
    const mockState = {
      ...initialState,
      issueComments: [
        { ...mocks.issueComment1 },
        { ...mocks.issueComment2 },
        { ...mocks.issueComment3 },
      ],
    };
    const mockAction = {
      type: types.REMOVE_ISSUE_COMMENT,
      payload: { ...mocks.issueComment2 },
    };
    const expectedState = {
      ...initialState,
      issueComments: [{ ...mocks.issueComment1 }, { ...mocks.issueComment3 }],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle REMOVE_SPRINT_ISSUES_METADATA', () => {
    const mockState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint2.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint3.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    const mockAction = {
      type: types.REMOVE_SPRINT_ISSUES_METADATA,
      payload: mocks.sprint2.id,
    };
    const expectedState = {
      ...initialState,
      sprintIssuesMetadatas: [
        { id: mocks.sprint1.id, metadata: { ...mocks.issuesMetadata } },
        { id: mocks.sprint3.id, metadata: { ...mocks.issuesMetadata } },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_BACKLOG_ISSUES_METADATA', () => {
    const mockBacklogIssuesMetadata = { ...mocks.issuesMetadata };
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_BACKLOG_ISSUES_METADATA,
      payload: { ...mockBacklogIssuesMetadata },
    };
    const expectedState = {
      ...initialState,
      backlogIssuesMetadata: { ...mockBacklogIssuesMetadata },
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

  it('should handle SET_ISSUE_COMMENTS_METADATA', () => {
    const mockIssueCommentsMetadata = { ...mocks.issueCommentsMetadata };
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_ISSUE_COMMENTS_METADATA,
      payload: { ...mockIssueCommentsMetadata },
    };
    const expectedState = {
      ...initialState,
      issueCommentsMetadata: { ...mockIssueCommentsMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_ISSUE_STATUSES', () => {
    const mockIssueStatuses = [...mocks.issueStatuses];
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_ISSUE_STATUSES,
      payload: [...mockIssueStatuses],
    };
    const expectedState = {
      ...initialState,
      issueStatuses: [...mockIssueStatuses],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_ISSUE_TYPES', () => {
    const mockIssueTypes = [...mocks.issueTypes];
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_ISSUE_TYPES,
      payload: [...mockIssueTypes],
    };
    const expectedState = {
      ...initialState,
      issueTypes: [...mockIssueTypes],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_ISSUES_METADATA', () => {
    const mockIssuesMetadata = { ...mocks.issuesMetadata };
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_ISSUES_METADATA,
      payload: { ...mockIssuesMetadata },
    };
    const expectedState = {
      ...initialState,
      issuesMetadata: { ...mockIssuesMetadata },
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle SET_PRIORITY_TYPES', () => {
    const mockPriorityTypes = [...mocks.priorityTypes];
    const mockState = { ...initialState };
    const mockAction = {
      type: types.SET_PRIORITY_TYPES,
      payload: [...mockPriorityTypes],
    };
    const expectedState = {
      ...initialState,
      priorityTypes: [...mockPriorityTypes],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });

  it('should handle UPDATE_ISSUES', () => {
    const mockState = {
      ...initialState,
      issues: [
        { ...mocks.backlogIssue1 },
        { ...mocks.backlogIssue2 },
        { ...mocks.backlogIssue3 },
      ],
    };
    const updatedIssue1 = {
      ...mocks.backlogIssue1,
      summary: 'Issue 1 (updated)',
    };
    const updatedIssue3 = {
      ...mocks.backlogIssue3,
      summary: 'Issue 3 (updated)',
    };
    const mockAction = {
      type: types.UPDATE_ISSUES,
      payload: [{ ...updatedIssue1 }, { ...updatedIssue3 }],
    };
    const expectedState = {
      ...initialState,
      issues: [
        { ...updatedIssue1 },
        { ...mocks.backlogIssue2 },
        { ...updatedIssue3 },
      ],
    };
    expect(reducer(mockState, mockAction)).toEqual(expectedState);
  });
});
