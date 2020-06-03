import { IssueAction } from 'constants/actionTypes';
import {
  showErrorAlert,
  showQueryErrorAlert,
  showMutationErrorAlert,
} from 'services/notifications';

export const addIssue = issue => ({
  type: IssueAction.ADD_ISSUE,
  payload: issue,
});

export const addIssueComments = issueComments => ({
  type: IssueAction.ADD_ISSUE_COMMENTS,
  payload: issueComments,
});

export const addIssues = issues => ({
  type: IssueAction.ADD_ISSUES,
  payload: issues,
});

export const addSprintIssuesMetadata = (sprintId, metadata) => ({
  type: IssueAction.ADD_SPRINT_ISSUES_METADATA,
  payload: {
    sprintId,
    metadata,
  },
});

export const clearAllIssueMetadatas = () => ({
  type: IssueAction.CLEAR_ALL_ISSUE_METADATAS,
});

export const clearBacklogIssues = () => ({
  type: IssueAction.CLEAR_BACKLOG_ISSUES,
});

export const clearBacklogIssuesMetadata = () => ({
  type: IssueAction.CLEAR_BACKLOG_ISSUES_METADATA,
});

export const clearIssueComments = () => ({
  type: IssueAction.CLEAR_ISSUE_COMMENTS,
});

export const clearIssueCommentsMetadata = () => ({
  type: IssueAction.CLEAR_ISSUE_COMMENTS_METADATA,
});

export const clearIssues = () => ({
  type: IssueAction.CLEAR_ISSUES,
});

export const clearIssuesMetadata = () => ({
  type: IssueAction.CLEAR_ISSUES_METADATA,
});

export const clearSprintIssues = sprintId => ({
  type: IssueAction.CLEAR_SPRINT_ISSUES,
  payload: sprintId,
});

export const clearSprintIssuesMetadatas = () => ({
  type: IssueAction.CLEAR_SPRINT_ISSUES_METADATAS,
});

export const removeIssueComment = comment => ({
  type: IssueAction.REMOVE_ISSUE_COMMENT,
  payload: comment,
});

export const removeSprintIssuesMetadata = sprintId => ({
  type: IssueAction.REMOVE_SPRINT_ISSUES_METADATA,
  payload: sprintId,
});

export const setBacklogIssuesMetadata = metadata => ({
  type: IssueAction.SET_BACKLOG_ISSUES_METADATA,
  payload: metadata,
});

export const setIsLoading = isLoading => ({
  type: IssueAction.SET_IS_LOADING,
  payload: isLoading,
});

export const setIssueCommentsMetadata = metadata => ({
  type: IssueAction.SET_ISSUE_COMMENTS_METADATA,
  payload: metadata,
});

export const setIssuesMetadata = metadata => ({
  type: IssueAction.SET_ISSUES_METADATA,
  payload: metadata,
});

export const setIssueStatuses = issueStatuses => ({
  type: IssueAction.SET_ISSUE_STATUSES,
  payload: issueStatuses,
});

export const setIssueTypes = issueTypes => ({
  type: IssueAction.SET_ISSUE_TYPES,
  payload: issueTypes,
});

export const setPriorityTypes = priorityTypes => ({
  type: IssueAction.SET_PRIORITY_TYPES,
  payload: priorityTypes,
});

export const updateIssues = issues => ({
  type: IssueAction.UPDATE_ISSUES,
  payload: issues,
});

// Dispatchers

export const clearAllIssueMetadatasAction = () => dispatch => {
  dispatch(clearAllIssueMetadatas());
};

export const clearBacklogIssuesAction = () => dispatch => {
  dispatch(clearBacklogIssues());
};

export const clearBacklogIssuesMetadataAction = () => dispatch => {
  dispatch(clearBacklogIssuesMetadata());
};

export const clearIssueCommentsAction = () => dispatch => {
  dispatch(clearIssueComments());
};

export const clearIssueCommentsMetadataAction = () => dispatch => {
  dispatch(clearIssueCommentsMetadata());
};

export const clearIssuesAction = () => dispatch => {
  dispatch(clearIssues());
};

export const clearIssuesMetadataAction = () => dispatch => {
  dispatch(clearIssuesMetadata());
};

export const clearSprintIssuesAction = sprintId => dispatch => {
  dispatch(clearSprintIssues(sprintId));
};

export const createIssueAction = issue => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.CREATE_ISSUE,
    payload: {
      request: {
        method: 'POST',
        url: '/issues',
        data: { ...issue },
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.CREATE_ISSUE_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(addIssue(issue));
    }
    if (type === `${IssueAction.CREATE_ISSUE_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't save your issue. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const createIssueCommentAction = (
  issue,
  comment,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  const { id: issueId } = issue || {};

  if (issueId) {
    return dispatch({
      type: IssueAction.CREATE_ISSUE_COMMENT,
      payload: {
        request: {
          method: 'POST',
          url: `/issues/${issueId}/comments`,
          data: {
            ...comment,
          },
        },
      },
    }).then(({ type }) => {
      if (type === `${IssueAction.CREATE_ISSUE_COMMENT_SUCCESS}`) {
        dispatch(setIsLoading(false));
        dispatch(clearIssueComments());
        dispatch(clearIssueCommentsMetadata());
        if (callback) {
          callback();
        }
      }
      if (type === `${IssueAction.CREATE_ISSUE_COMMENT_FAIL}`) {
        showErrorAlert(
          "We're sorry, we couldn't save your comment. Please try again.",
        );
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const deleteIssueCommentAction = (issue, comment) => dispatch => {
  dispatch(setIsLoading(true));

  const { id: issueId } = issue || {};
  const { id: commentId } = comment || {};

  if (issueId && commentId) {
    return dispatch({
      type: IssueAction.DELETE_ISSUE_COMMENT,
      payload: {
        request: {
          method: 'DELETE',
          url: `/issues/${issueId}/comments/${commentId}`,
        },
      },
    }).then(({ type }) => {
      if (type === `${IssueAction.DELETE_ISSUE_COMMENT_SUCCESS}`) {
        dispatch(setIsLoading(false));
        dispatch(removeIssueComment(comment));
      }
      if (type === `${IssueAction.DELETE_ISSUE_COMMENT_FAIL}`) {
        showErrorAlert(
          "We're sorry, we couldn't delete your comment. Please try again.",
        );
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const getBacklogIssuesAction = projectId => (dispatch, getState) => {
  dispatch(setIsLoading(true));

  const state = getState();
  const { pageSize = 100, cursor = '' } =
    state?.issueStore?.backlogIssuesMetadata?.pagination || {};

  return dispatch({
    type: IssueAction.GET_BACKLOG_ISSUES,
    payload: {
      request: {
        method: 'GET',
        url: `/projects/${projectId}/backlog/issues?pageSize=${pageSize}${
          cursor && `&cursor=${cursor}`
        }`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${IssueAction.GET_BACKLOG_ISSUES_SUCCESS}`) {
      const { issues, metadata } = payload;

      dispatch(setIsLoading(false));
      dispatch(addIssues(issues));
      dispatch(setBacklogIssuesMetadata(metadata));
    }
    if (type === `${IssueAction.GET_BACKLOG_ISSUES_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getIssueAction = issueId => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.GET_ISSUE,
    payload: {
      request: {
        method: 'GET',
        url: `/issues/${issueId}`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${IssueAction.GET_ISSUE_SUCCESS}`) {
      const { issue } = payload;

      dispatch(setIsLoading(false));
      dispatch(addIssue(issue));
    }
    if (type === `${IssueAction.GET_ISSUE_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getIssueCommentsAction = issueId => (dispatch, getState) => {
  dispatch(setIsLoading(true));

  const state = getState();
  const { pageSize = 100, cursor = '' } =
    state?.issueStore?.issueCommentsMetadata?.pagination || {};

  return dispatch({
    type: IssueAction.GET_ISSUE_COMMENTS,
    payload: {
      request: {
        method: 'GET',
        url: `/issues/${issueId}/comments?pageSize=${pageSize}${
          cursor && `&cursor=${cursor}`
        }`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${IssueAction.GET_ISSUE_COMMENTS_SUCCESS}`) {
      const { issueComments, metadata } = payload;

      dispatch(setIsLoading(false));
      dispatch(addIssueComments(issueComments));
      dispatch(setIssueCommentsMetadata(metadata));
    }
    if (type === `${IssueAction.GET_ISSUE_COMMENTS_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getIssuesAction = projectId => (dispatch, getState) => {
  dispatch(setIsLoading(true));

  const state = getState();
  const { pageSize = 100, cursor = '' } =
    state?.issueStore?.issuesMetadata?.pagination || {};

  return dispatch({
    type: IssueAction.GET_ISSUES,
    payload: {
      request: {
        method: 'GET',
        url: `/projects/${projectId}/issues?pageSize=${pageSize}${
          cursor && `&cursor=${cursor}`
        }`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${IssueAction.GET_ISSUES_SUCCESS}`) {
      const { issues, metadata } = payload;

      dispatch(setIsLoading(false));
      dispatch(addIssues(issues));
      dispatch(setIssuesMetadata(metadata));
    }
    if (type === `${IssueAction.GET_ISSUES_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const getIssueStatusesAction = () => (dispatch, getState) => {
  const state = getState();
  const { issueStatuses: currentIssueStatuses } = state.issueStore || {};

  if (!currentIssueStatuses.length) {
    dispatch(setIsLoading(true));

    return dispatch({
      type: IssueAction.GET_ISSUE_STATUSES,
      payload: {
        request: {
          method: 'GET',
          url: '/issueStatuses',
        },
      },
    }).then(({ type, payload }) => {
      if (type === `${IssueAction.GET_ISSUE_STATUSES_SUCCESS}`) {
        dispatch(setIsLoading(false));
        const { issueStatuses } = payload;
        dispatch(setIssueStatuses(issueStatuses));
      }
      if (type === `${IssueAction.GET_ISSUE_STATUSES_FAIL}`) {
        showQueryErrorAlert();
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const getIssueTypesAction = () => (dispatch, getState) => {
  const state = getState();
  const { issueTypes: currentIssueTypes } = state.issueStore || {};

  if (!currentIssueTypes.length) {
    dispatch(setIsLoading(true));

    return dispatch({
      type: IssueAction.GET_ISSUE_TYPES,
      payload: {
        request: {
          method: 'GET',
          url: '/issueTypes',
        },
      },
    }).then(({ type, payload }) => {
      if (type === `${IssueAction.GET_ISSUE_TYPES_SUCCESS}`) {
        dispatch(setIsLoading(false));
        const { issueTypes } = payload;
        dispatch(setIssueTypes(issueTypes));
      }
      if (type === `${IssueAction.GET_ISSUE_TYPES_FAIL}`) {
        showQueryErrorAlert();
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const getPriorityTypesAction = () => (dispatch, getState) => {
  const state = getState();
  const { priorityTypes: currentPriorityTypes } = state.issueStore || {};

  if (!currentPriorityTypes.length) {
    dispatch(setIsLoading(true));

    return dispatch({
      type: IssueAction.GET_PRIORITY_TYPES,
      payload: {
        request: {
          method: 'GET',
          url: '/priorityTypes',
        },
      },
    }).then(({ type, payload }) => {
      if (type === `${IssueAction.GET_PRIORITY_TYPES_SUCCESS}`) {
        dispatch(setIsLoading(false));
        const { priorityTypes } = payload;
        dispatch(setPriorityTypes(priorityTypes));
      }
      if (type === `${IssueAction.GET_PRIORITY_TYPES_FAIL}`) {
        showQueryErrorAlert();
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const getSprintIssuesAction = (projectId, sprintId) => (
  dispatch,
  getState,
) => {
  dispatch(setIsLoading(true));

  const state = getState();
  const { sprintIssuesMetadatas } = state?.issueStore;
  const sprintIssuesMetadata = sprintIssuesMetadatas.find(
    ({ id }) => id === sprintId,
  );
  const { pageSize = 100, cursor = '' } =
    sprintIssuesMetadata?.pagination || {};

  return dispatch({
    type: IssueAction.GET_SPRINT_ISSUES,
    payload: {
      request: {
        method: 'GET',
        url: `/projects/${projectId}/sprints/${sprintId}/issues?pageSize=${pageSize}${
          cursor && `&cursor=${cursor}`
        }`,
      },
    },
  }).then(({ type, payload }) => {
    if (type === `${IssueAction.GET_SPRINT_ISSUES_SUCCESS}`) {
      const { issues, metadata } = payload;

      dispatch(setIsLoading(false));
      dispatch(addIssues(issues));
      dispatch(addSprintIssuesMetadata(sprintId, metadata));
    }
    if (type === `${IssueAction.GET_SPRINT_ISSUES_FAIL}`) {
      showQueryErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const removeSprintIssuesMetadataAction = sprintId => dispatch => {
  dispatch(removeSprintIssuesMetadata(sprintId));
};

export const sendIssueToBottomOfBacklogAction = (
  projectId,
  issueId,
  fromSprintId,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/backlog/issues/${issueId}/bottom`,
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(clearBacklogIssuesMetadata());
      if (fromSprintId) {
        dispatch(removeSprintIssuesMetadata(fromSprintId));
      }
      if (callback) {
        callback();
      }
    }
    if (type === `${IssueAction.SEND_ISSUE_TO_BOTTOM_OF_BACKLOG_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't move your issue. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const sendIssueToSprintAction = (
  projectId,
  sprintId,
  issueId,
  fromSprintId,
  status,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.SEND_ISSUE_TO_SPRINT,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/sprints/${sprintId}/issues/${issueId}`,
        data: {
          status,
        },
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.SEND_ISSUE_TO_SPRINT_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(clearBacklogIssuesMetadata());
      dispatch(removeSprintIssuesMetadata(sprintId));
      if (fromSprintId) {
        dispatch(removeSprintIssuesMetadata(fromSprintId));
      }
      if (callback) {
        callback();
      }
    }
    if (type === `${IssueAction.SEND_ISSUE_TO_SPRINT_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't move your issue. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const sendIssueToTopOfBacklogAction = (
  projectId,
  issueId,
  fromSprintId,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.SEND_ISSUE_TO_TOP_OF_BACKLOG,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/backlog/issues/${issueId}/top`,
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.SEND_ISSUE_TO_TOP_OF_BACKLOG_SUCCESS}`) {
      dispatch(setIsLoading(false));
      dispatch(clearBacklogIssuesMetadata());
      if (fromSprintId) {
        dispatch(removeSprintIssuesMetadata(fromSprintId));
      }
      if (callback) {
        callback();
      }
    }
    if (type === `${IssueAction.SEND_ISSUE_TO_TOP_OF_BACKLOG_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't move your issue. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const updateIssueAction = (projectId, issue, callback) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.UPDATE_ISSUE,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/issues/${issue?.id}`,
        data: {
          ...issue,
        },
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.UPDATE_ISSUE_SUCCESS}`) {
      dispatch(setIsLoading(false));
      if (callback) {
        callback();
      }
    }
    if (type === `${IssueAction.UPDATE_ISSUE_FAIL}`) {
      showErrorAlert(
        "We're sorry, we couldn't update your issue. Please try again.",
      );
      dispatch(setIsLoading(false));
    }
  });
};

export const updateIssueCommentAction = (
  issueId,
  comment,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  const { id: commentId } = comment || {};

  if (issueId && commentId) {
    return dispatch({
      type: IssueAction.UPDATE_ISSUE_COMMENT,
      payload: {
        request: {
          method: 'PUT',
          url: `/issues/${issueId}/comments/${commentId}`,
          data: {
            ...comment,
          },
        },
      },
    }).then(({ type }) => {
      if (type === `${IssueAction.UPDATE_ISSUE_COMMENT_SUCCESS}`) {
        dispatch(setIsLoading(false));
        dispatch(clearIssueComments());
        dispatch(clearIssueCommentsMetadata());
        if (callback) {
          callback();
        }
      }
      if (type === `${IssueAction.UPDATE_ISSUE_COMMENT_FAIL}`) {
        showErrorAlert(
          "We're sorry, we couldn't update your comment. Please try again.",
        );
        dispatch(setIsLoading(false));
      }
    });
  }

  return null;
};

export const updateIssueOrdinalsAction = (
  projectId,
  issueOrdinals,
  sprintId,
  callback,
) => dispatch => {
  dispatch(setIsLoading(true));

  return dispatch({
    type: IssueAction.UPDATE_ISSUE_ORDINALS,
    payload: {
      request: {
        method: 'PUT',
        url: `/projects/${projectId}/issue/ordinals`,
        data: {
          issueOrdinals,
        },
      },
    },
  }).then(({ type }) => {
    if (type === `${IssueAction.UPDATE_ISSUE_ORDINALS_SUCCESS}`) {
      dispatch(setIsLoading(false));
      if (sprintId) {
        dispatch(clearSprintIssuesMetadatas());
      } else {
        dispatch(clearBacklogIssues());
      }
      if (callback) {
        callback();
      }
    }
    if (type === `${IssueAction.UPDATE_ISSUE_ORDINALS_FAIL}`) {
      showMutationErrorAlert();
      dispatch(setIsLoading(false));
    }
  });
};

export const updateIssuesAction = issues => dispatch => {
  dispatch(updateIssues(issues));
};
