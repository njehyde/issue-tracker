export const defaultPagination = { pageSize: 100, cursor: '' };

export const initialPopoverPosition = {
  top: null,
  left: null,
};

export const inputDateFormat = 'YYYY-MM-DD';

export const defaultUserProjectChangesMessage =
  'Another user has made changes to this project.';

export const defaultQueryErrorMessage =
  "We're sorry, we couldn't find something you wanted. Please reload the page.";
export const defaultMutationErrorMessage =
  "We're sorry, something went wrong. Please try again.";

export const projectChangeTypes = {
  IssueAdded: 'ISSUE_ADDED', // p
  ProjectBoardSprintAdded: 'PROJECT_BOARD_SPRINT_ADDED', // p
  IssueUpdated: 'ISSUE_UPDATED', // p
  ProjectUpdated: 'PROJECT_UPDATED', // p
  ProjectBoardSprintUpdated: 'PROJECT_BOARD_SPRINT_UPDATED', // p
  IssueDeleted: 'ISSUE_DELETED', //
  ProjectDeleted: 'PROJECT_DELETED', // p
  ProjectBoardSprintDeleted: 'PROJECT_BOARD_SPRINT_DELETED', // p
};

export const rootChangeTypes = {
  ProjectAdded: 'PROJECT_ADDED',
  ProjectDeleted: 'PROJECT_DELETED',
};

export const issueChangeType = {
  IssueCommentAdded: 'ISSUE_COMMENT_ADDED',
  IssueUpdated: 'ISSUE_UPDATED',
  IssueCommentUpdated: 'ISSUE_COMMENT_UPDATED',
  IssueDeleted: 'ISSUE_DELETED',
  IssueCommentDeleted: 'ISSUE_COMMENT_DELETED',
};
