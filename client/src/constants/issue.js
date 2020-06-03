import { defaultPagination } from 'constants';

export const issuePoints = [0, 1, 2, 3, 5, 8, 13, 21];

/* The DnD status types for issue cards */
export const IssueDropType = {
  CARD: 'CARD',
  STATUS: 'STATUS',
};

export const defaultIssueMetadata = {
  pagination: {
    ...defaultPagination,
  },
  count: 0,
  filters: [],
};

export const defaultIssueCommentMetadata = {
  pagination: {
    ...defaultPagination,
  },
  count: 0,
  filters: [],
};
