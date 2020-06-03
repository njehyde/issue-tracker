export const getIssuesByColumnMap = (columns = [], issues = []) => {
  return columns.reduce((map, column) => {
    const { issueStatuses = [] } = column;
    const columnIssues = issues
      .filter(({ status }) => issueStatuses.includes(status))
      .sort((a, b) => a?.ordinal - b?.ordinal);
    map.set(column, columnIssues);

    return map;
  }, new Map());
};

export const applyBacklogFilter = issues =>
  issues.filter(issue => !issue.sprintId);

export const applySprintFilter = (sprintId, issues) =>
  issues.filter(issue => issue.sprintId === sprintId);

export const getIssuesCountText = count => {
  if (!count) {
    return null;
  }
  return `${count} ${count === 1 ? 'issue' : 'issues'}`;
};
