import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import MenuItem from 'components/core/MenuItem';
import IssueCard from 'components/issue/IssueCard';

import Column from './Column';
import Styled from './styled';

const sortIssues = (a, b) => a.ordinal - b.ordinal;
const updateOrdinals = (item, index) => ({ ...item, ordinal: index });

const getMaxColumnSize = (columns, issues) => {
  return columns
    .map(({ issueStatuses }) => issueStatuses)
    .reduce((accumulator, issueStatuses) => {
      const { length } = issues.filter(({ status }) =>
        issueStatuses.includes(status),
      );
      if (length > accumulator) {
        return length;
      }
      return accumulator;
    }, 0);
};

const Columns = ({
  columns,
  otherSprints,
  issues,
  sprintId,
  onClickIssue,
  onSendIssueToBottomOfBacklog,
  onSendIssueToTopOfBacklog,
  onSendIssueToSprint,
  onUpdateIssues,
  onUpdateIssueOrdinals,
}) => {
  const maxColumnSize = getMaxColumnSize(columns, issues);

  // Array of column issues statuses
  const columnIssueStatuses = columns.reduce((result, column) => {
    const { issueStatuses = [] } = column;
    if (issueStatuses.length) {
      return [...result, issueStatuses];
    }
    return result;
  }, []);

  const findIssue = useCallback(
    (id, status) => {
      const statuses = columnIssueStatuses.find(issueStatuses =>
        issueStatuses.includes(status),
      );
      const sortedStatusIssues = issues
        .filter(issue => statuses.includes(issue.status))
        .sort(sortIssues);
      const issue = issues.find(c => c.id === id);
      return {
        issue,
        index: sortedStatusIssues.indexOf(issue),
      };
    },
    [issues],
  );

  const moveIssue = (id, atIndex, status) => {
    const statuses = columnIssueStatuses.find(issueStatuses =>
      issueStatuses.includes(status),
    );
    const nonStatusIssues = issues.filter(
      issue => !statuses.includes(issue.status),
    );
    const sortedStatusIssues = issues
      .filter(issue => statuses.includes(issue.status))
      .sort(sortIssues);
    const { issue, index } = findIssue(id, status);
    const updatedIndexIssues = update(sortedStatusIssues, {
      $splice: [
        [index, 1],
        [atIndex, 0, issue],
      ],
    }).map(updateOrdinals);

    const updatedIssues = [...updatedIndexIssues, ...nonStatusIssues];

    onUpdateIssues(updatedIssues);
  };

  const updateIssue = (id, status, newSprintId) => {
    const movingIssue = newSprintId && issues.find(issue => issue.id === id);
    if (movingIssue) {
      onSendIssueToSprint(movingIssue.id, newSprintId, status);
    }

    let updatedIssues = issues
      .filter(issue => !newSprintId || (newSprintId && issue.id !== id))
      .sort(sortIssues)
      .map((issue, index) => {
        const updatedStatus = issue.id === id ? status : issue.status;
        return { ...issue, status: updatedStatus, ordinal: index };
      });

    const issuesByStatusesMap = columns.reduce((result, column) => {
      result.set(
        column.issueStatuses,
        updatedIssues
          .filter(issue => column.issueStatuses.includes(issue.status))
          .sort(sortIssues)
          .map(updateOrdinals),
      );
      return result;
    }, new Map());

    updatedIssues = Array.from(issuesByStatusesMap).reduce(
      (result, [, value]) => [...result, ...value],
      [],
    );

    const issueOrdinals = updatedIssues.map(
      ({ id: issueId, status: issueStatus }, index) => ({
        id: issueId,
        ordinal: index,
        status: issueStatus,
      }),
    );

    onUpdateIssueOrdinals(issueOrdinals);
  };

  const getIssueMenuItems = issue => (
    <>
      {otherSprints &&
        otherSprints.map(sprint => (
          <MenuItem
            key={sprint?.id}
            onClick={() => onSendIssueToSprint(issue?.id, sprint?.id)}
          >
            {sprint?.name}
          </MenuItem>
        ))}
      <MenuItem
        onClick={() => onSendIssueToTopOfBacklog(issue?.id, issue?.sprintId)}
      >
        Top of Backlog
      </MenuItem>
      <MenuItem
        onClick={() => onSendIssueToBottomOfBacklog(issue?.id, issue?.sprintId)}
      >
        Bottom of Backlog
      </MenuItem>
    </>
  );

  return (
    <Styled.Swimlane>
      <Styled.Columns>
        {columns &&
          columns.map(column => {
            const columnIssues = issues
              .filter(({ status }) => column.issueStatuses.includes(status))
              .sort(sortIssues);

            return (
              <Column
                key={column?.ordinal}
                sprintId={sprintId}
                statuses={column.issueStatuses}
                maxColumnSize={maxColumnSize}
              >
                {columnIssues &&
                  columnIssues.map(issue => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      menuItems={getIssueMenuItems(issue)}
                      onClick={onClickIssue}
                      onFindIssue={findIssue}
                      onMoveIssue={moveIssue}
                      onUpdateIssue={updateIssue}
                    />
                  ))}
              </Column>
            );
          })}
      </Styled.Columns>
    </Styled.Swimlane>
  );
};

Columns.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  otherSprints: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  sprintId: PropTypes.string,
  onClickIssue: PropTypes.func.isRequired,
  onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
  onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
  onSendIssueToSprint: PropTypes.func.isRequired,
  onUpdateIssues: PropTypes.func.isRequired,
  onUpdateIssueOrdinals: PropTypes.func.isRequired,
};

export default Columns;
