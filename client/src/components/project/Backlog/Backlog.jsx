import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from 'rebass';

import MenuItem from 'components/core/MenuItem';
import Modal from 'components/core/Modal';
import EditSprintForm from 'components/forms/EditSprintForm';
import StartSprintForm from 'components/forms/StartSprintForm';
import IssueSection from 'components/issue/IssueSection';
import IssueRow from 'components/issue/IssueRow';
import Sprint from 'components/project/Sprint';
import { Button, Heading } from 'components/styled';
import { getIssuesCountText } from 'utils/issue';

const Backlog = ({
  board,
  issues,
  issuesCount,
  project,
  onCreateSprint,
  onDeleteSprint,
  onSendIssueToBottomOfBacklog,
  onSendIssueToSprint,
  onSendIssueToTopOfBacklog,
  onUpdateIssue,
  onUpdateSprint,
}) => {
  const [issueBeingEdited, setIssueBeingEdited] = useState(null);
  const [sprintBeingEdited, setSprintBeingEdited] = useState(null);
  const [sprintBeingStarted, setSprintBeingStarted] = useState(null);
  const { sprints } = board || {};

  const getBacklogIssueMenuItems = issue => (
    <>
      {sprints &&
        sprints.map(sprint => (
          <MenuItem
            key={sprint?.id}
            onClick={() => onSendIssueToSprint(issue?.id, sprint?.id)}
          >
            {sprint?.name}
          </MenuItem>
        ))}
      <MenuItem onClick={() => onSendIssueToTopOfBacklog(issue?.id)}>
        Top of Backlog
      </MenuItem>
      <MenuItem onClick={() => onSendIssueToBottomOfBacklog(issue?.id)}>
        Bottom of Backlog
      </MenuItem>
    </>
  );

  return (
    <>
      <Flex flexDirection="column">
        {sprints && (
          <Box width={1}>
            {sprints.map(sprint => (
              <Sprint
                key={sprint?.id}
                project={project}
                board={board}
                sprint={sprint}
                onClickIssue={setIssueBeingEdited}
                onDeleteSprint={onDeleteSprint}
                onEditSprint={setSprintBeingEdited}
                onStartSprint={setSprintBeingStarted}
                onSendIssueToSprint={onSendIssueToSprint}
                onSendIssueToTopOfBacklog={onSendIssueToTopOfBacklog}
                onSendIssueToBottomOfBacklog={onSendIssueToBottomOfBacklog}
              />
            ))}
          </Box>
        )}
        <Box width={1}>
          <Flex mb="1rem" justifyContent="space-between">
            <Box>
              <Flex>
                <Box>
                  <Heading.H5>Backlog</Heading.H5>
                </Box>
                <Box ml="2" alignSelf="center">
                  <span>{getIssuesCountText(issuesCount)}</span>
                </Box>
              </Flex>
            </Box>
            <Box>
              <Button primary invert onClick={onCreateSprint}>
                Create Sprint
              </Button>
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
                  menuItems={getBacklogIssueMenuItems(issue)}
                  onClick={() => setIssueBeingEdited(issue)}
                />
              ))}
        </Box>
      </Flex>
      {!!issueBeingEdited && (
        <Modal
          l
          title="Update issue"
          show={!!issueBeingEdited}
          closeModal={() => setIssueBeingEdited(null)}
        >
          <IssueSection
            key={issueBeingEdited?.id}
            issue={issueBeingEdited}
            onUpdateIssue={issue => {
              // TODO: Add a callback instead so the modal is dismissed on success or error
              onUpdateIssue(issue);
              setIssueBeingEdited(null);
            }}
          />
        </Modal>
      )}
      {!!sprintBeingEdited && (
        <Modal
          m
          title="Edit sprint"
          show={!!sprintBeingEdited}
          closeModal={() => setSprintBeingEdited(null)}
        >
          <EditSprintForm
            sprint={sprintBeingEdited}
            onSubmit={(sprintId, sprint) => {
              onUpdateSprint(sprintId, sprint);
              setSprintBeingEdited(null);
            }}
            onCancel={() => setSprintBeingEdited(null)}
          />
        </Modal>
      )}
      {!!sprintBeingStarted && (
        <Modal
          m
          title="Start sprint"
          show={!!sprintBeingStarted}
          closeModal={() => setSprintBeingStarted(null)}
        >
          <StartSprintForm
            sprint={sprintBeingStarted}
            onSubmit={(sprintId, sprint) => {
              onUpdateSprint(sprintId, sprint);
              setSprintBeingStarted(null);
            }}
            onCancel={() => setSprintBeingStarted(null)}
          />
        </Modal>
      )}
    </>
  );
};

Backlog.propTypes = {
  board: PropTypes.objectOf(PropTypes.any).isRequired,
  issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  issuesCount: PropTypes.number,
  project: PropTypes.objectOf(PropTypes.any).isRequired,
  onCreateSprint: PropTypes.func.isRequired,
  onDeleteSprint: PropTypes.func.isRequired,
  onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
  onSendIssueToSprint: PropTypes.func.isRequired,
  onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
  onUpdateIssue: PropTypes.func.isRequired,
  onUpdateSprint: PropTypes.func.isRequired,
};

export default Backlog;
