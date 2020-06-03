import mapActionToReducer from 'redux-action-reducer-mapper';
import { IssueAction } from 'constants/actionTypes';
import {
  defaultIssueMetadata,
  defaultIssueCommentMetadata,
} from 'constants/issue';
import { getArrayIndexForId, updateArrayByIndex } from 'utils';

export const initialState = {
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
};

const addIssueComments = (state, action) => {
  const { payload: issueComments } = action;

  const updatedIssueComments = state.issueComments.map(issueComment => {
    const existingIssueComment = issueComments.find(
      existing => existing.id === issueComment.id,
    );
    if (existingIssueComment) {
      return existingIssueComment;
    }
    return issueComment;
  });

  const newIssueComments = issueComments.filter(
    issueComment =>
      !state.issueComments.find(existing => existing.id === issueComment.id),
  );

  return {
    ...state,
    issueComments: [...updatedIssueComments, ...newIssueComments],
  };
};

const addIssue = (state, action) => {
  let updatedArray;
  const { id } = action.payload;
  const index = getArrayIndexForId(state.issues, id);

  if (index === -1) {
    updatedArray = [...state.issues, { ...action.payload }];
  } else {
    updatedArray = updateArrayByIndex(state.issues, index, {
      ...action.payload,
    });
  }

  return {
    ...state,
    issues: updatedArray,
  };
};

const addIssues = (state, action) => {
  const { payload: issues } = action;

  const updatedIssues = state.issues.map(issue => {
    const existingIssue = issues.find(existing => existing.id === issue.id);
    if (existingIssue) {
      return existingIssue;
    }
    return issue;
  });

  const newIssues = issues.filter(
    issue => !state.issues.find(existing => existing.id === issue.id),
  );

  return {
    ...state,
    issues: [...updatedIssues, ...newIssues],
  };
};

const addSprintIssuesMetadata = (state, action) => {
  let updatedArray;
  const { sprintId, metadata } = action.payload;
  const index = getArrayIndexForId(state.sprintIssuesMetadatas, sprintId);

  const newMetadata = {
    id: sprintId,
    metadata,
  };

  if (index === -1) {
    updatedArray = [...state.sprintIssuesMetadatas, newMetadata];
  } else {
    updatedArray = updateArrayByIndex(
      state.sprintIssuesMetadatas,
      index,
      newMetadata,
    );
  }

  return {
    ...state,
    sprintIssuesMetadatas: updatedArray,
  };
};

const clearAllIssueMetadatas = state => ({
  ...state,
  issuesMetadata: { ...defaultIssueMetadata },
  backlogIssuesMetadata: { ...defaultIssueMetadata },
  sprintIssuesMetadatas: [],
  issueCommentsMetadata: { ...defaultIssueCommentMetadata },
});

const clearBacklogIssuesMetadata = state => ({
  ...state,
  backlogIssuesMetadata: { ...defaultIssueMetadata },
});

const clearBacklogIssues = state => ({
  ...state,
  issues: state.issues.filter(issue => !!issue.sprintId),
});

const clearIssueCommentsMetadata = state => ({
  ...state,
  issueCommentsMetadata: { ...defaultIssueCommentMetadata },
});

const clearIssueComments = state => ({
  ...state,
  issueComments: [],
});

const clearIssuesMetadata = state => ({
  ...state,
  issuesMetadata: { ...defaultIssueMetadata },
});

const clearIssues = state => ({
  ...state,
  issues: [],
});

const clearSprintIssuesMetadatas = state => ({
  ...state,
  sprintIssuesMetadatas: [],
});

const clearSprintIssues = (state, action) => {
  const { payload: sprintId } = action;
  return {
    ...state,
    issues: state.issues.filter(
      issue => !issue.sprintId || issue.sprintId !== sprintId,
    ),
  };
};

const removeIssueComment = (state, action) => {
  const { payload: comment } = action;

  return {
    ...state,
    issueComments: state.issueComments.filter(({ id }) => id !== comment?.id),
  };
};

const removeSprintIssuesMetadata = (state, action) => {
  const { payload: sprintId } = action;
  return {
    ...state,
    sprintIssuesMetadatas: state.sprintIssuesMetadatas.filter(
      metadata => metadata.id !== sprintId,
    ),
  };
};

const setBacklogIssuesMetadata = (state, action) => ({
  ...state,
  backlogIssuesMetadata: { ...action.payload },
});

const setIsLoading = (state, action) => ({
  ...state,
  isLoading: action.payload,
});

const setIssueCommentsMetadata = (state, action) => ({
  ...state,
  issueCommentsMetadata: { ...action.payload },
});

const setIssueStatuses = (state, action) => ({
  ...state,
  issueStatuses: [...action.payload],
});

const setIssueTypes = (state, action) => ({
  ...state,
  issueTypes: [...action.payload],
});

const setIssuesMetadata = (state, action) => ({
  ...state,
  issuesMetadata: { ...action.payload },
});

const setPriorityTypes = (state, action) => ({
  ...state,
  priorityTypes: [...action.payload],
});

const updateIssues = (state, action) => {
  const { payload: issues } = action;
  const updatedIssues = state.issues.map(
    issue => issues.find(i => i.id === issue.id) || issue,
  );

  return {
    ...state,
    issues: updatedIssues,
  };
};

const reducer = mapActionToReducer({
  default: initialState,
  [IssueAction.ADD_ISSUE_COMMENTS]: addIssueComments,
  [IssueAction.ADD_ISSUE]: addIssue,
  [IssueAction.ADD_ISSUES]: addIssues,
  [IssueAction.ADD_SPRINT_ISSUES_METADATA]: addSprintIssuesMetadata,
  [IssueAction.CLEAR_ALL_ISSUE_METADATAS]: clearAllIssueMetadatas,
  [IssueAction.CLEAR_BACKLOG_ISSUES_METADATA]: clearBacklogIssuesMetadata,
  [IssueAction.CLEAR_BACKLOG_ISSUES]: clearBacklogIssues,
  [IssueAction.CLEAR_ISSUE_COMMENTS_METADATA]: clearIssueCommentsMetadata,
  [IssueAction.CLEAR_ISSUE_COMMENTS]: clearIssueComments,
  [IssueAction.CLEAR_ISSUES_METADATA]: clearIssuesMetadata,
  [IssueAction.CLEAR_ISSUES]: clearIssues,
  [IssueAction.CLEAR_SPRINT_ISSUES_METADATAS]: clearSprintIssuesMetadatas,
  [IssueAction.CLEAR_SPRINT_ISSUES]: clearSprintIssues,
  [IssueAction.REMOVE_ISSUE_COMMENT]: removeIssueComment,
  [IssueAction.REMOVE_SPRINT_ISSUES_METADATA]: removeSprintIssuesMetadata,
  [IssueAction.SET_BACKLOG_ISSUES_METADATA]: setBacklogIssuesMetadata,
  [IssueAction.SET_IS_LOADING]: setIsLoading,
  [IssueAction.SET_ISSUE_COMMENTS_METADATA]: setIssueCommentsMetadata,
  [IssueAction.SET_ISSUE_STATUSES]: setIssueStatuses,
  [IssueAction.SET_ISSUE_TYPES]: setIssueTypes,
  [IssueAction.SET_ISSUES_METADATA]: setIssuesMetadata,
  [IssueAction.SET_PRIORITY_TYPES]: setPriorityTypes,
  [IssueAction.UPDATE_ISSUES]: updateIssues,
});

export default reducer;
