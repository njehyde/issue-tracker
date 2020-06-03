import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import MenuItem from 'components/core/MenuItem';
import IssueRow from 'components/issue/IssueRow';
import { Button, Heading, Text } from 'components/styled';
import { getFormattedDateTime } from 'utils/date';
import { getIssuesCountText } from 'utils/issue';

import SprintOptionsButton from './SprintOptionsButton';

const Sprint = ({
  board,
  sprint,
  issues,
  issuesCount,
  onClickIssue,
  onDeleteSprint,
  onEditSprint,
  onStartSprint,
  onSendIssueToSprint,
  onSendIssueToTopOfBacklog,
  onSendIssueToBottomOfBacklog,
}) => {
  const { sprints } = board;
  const sprintStarted = sprint.startAt;

  const getSprintIssueMenuItems = issue => (
    <>
      {sprints &&
        sprints
          .filter(s => s?.id !== sprint?.id)
          .map(s => (
            <MenuItem
              key={s?.id}
              onClick={() => onSendIssueToSprint(issue?.id, s?.id, sprint?.id)}
            >
              {s?.name}
            </MenuItem>
          ))}
      <MenuItem
        onClick={() => onSendIssueToTopOfBacklog(issue?.id, sprint?.id)}
      >
        Top of Backlog
      </MenuItem>
      <MenuItem
        onClick={() => onSendIssueToBottomOfBacklog(issue?.id, sprint?.id)}
      >
        Bottom of Backlog
      </MenuItem>
    </>
  );

  return (
    <Flex flexDirection="column" mb="2rem">
      <Box key={sprint?.id} width={1} mb="1rem">
        <Flex justifyContent="space-between">
          <Box>
            <Flex flexDirection="column">
              <Box>
                <Flex>
                  <Box>
                    <Heading.H5>{sprint?.name}</Heading.H5>
                  </Box>
                  <Box ml="2" alignSelf="center">
                    <span>{getIssuesCountText(issuesCount)}</span>
                  </Box>
                </Flex>
              </Box>
              {sprintStarted && (
                <Box>
                  <Flex>
                    <Box mr="1">
                      <Text.Secondary>
                        {getFormattedDateTime(sprint.startAt)}
                      </Text.Secondary>
                    </Box>
                    <Box mx="1">
                      <Text.Secondary>•</Text.Secondary>
                    </Box>
                    <Box mx="1">
                      <Text.Secondary>
                        {getFormattedDateTime(sprint.endAt)}
                      </Text.Secondary>
                    </Box>
                  </Flex>
                </Box>
              )}
            </Flex>
          </Box>
          <Box>
            <Flex>
              {!sprintStarted && (
                <Box mr="0.5rem">
                  <Button primary invert onClick={() => onStartSprint(sprint)}>
                    Start Sprint
                  </Button>
                </Box>
              )}
              <Box>
                <SprintOptionsButton
                  sprint={sprint}
                  onEditSprint={onEditSprint}
                  onDeleteSprint={onDeleteSprint}
                />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box width={1}>
        {issues &&
          issues
            .sort((a, b) => a.Ordinal - b.Ordinal)
            .map(issue => (
              <IssueRow
                key={issue?.id}
                issue={issue}
                menuItems={getSprintIssueMenuItems(issue)}
                onClick={() => onClickIssue(issue)}
              />
            ))}
      </Box>
    </Flex>
  );
};

Sprint.propTypes = {
  board: PropTypes.objectOf(PropTypes.any).isRequired,
  sprint: PropTypes.objectOf(PropTypes.any).isRequired,
  issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  issuesCount: PropTypes.number,
  onClickIssue: PropTypes.func.isRequired,
  onDeleteSprint: PropTypes.func.isRequired,
  onEditSprint: PropTypes.func.isRequired,
  onStartSprint: PropTypes.func.isRequired,
  onSendIssueToSprint: PropTypes.func.isRequired,
  onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
  onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
};

export default Sprint;
