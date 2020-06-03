import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/core/Modal';
import IssueSection from 'components/issue/IssueSection';
import { BoardType } from 'constants/project';

import KanbanBoard from './KanbanBoard';

const Board = ({
  board,
  issues,
  onSendIssueToBottomOfBacklog,
  onSendIssueToTopOfBacklog,
  onSendIssueToSprint,
  onUpdateIssue,
  onUpdateIssues,
  onUpdateIssueOrdinals,
}) => {
  const [issueBeingEdited, setIssueBeingEdited] = useState(null);
  const { type, sprints, columns } = board || {};

  return (
    <>
      {type === BoardType.KANBAN && (
        <KanbanBoard
          name={board?.name}
          columns={columns}
          issues={issues}
          onUpdateIssues={onUpdateIssues}
          onUpdateIssueOrdinals={onUpdateIssueOrdinals}
          setIssueBeingEdited={setIssueBeingEdited}
        />
      )}
      {type === BoardType.SCRUM &&
        sprints &&
        sprints.map(sprint => {
          const sprintIssues = issues.filter(
            issue => issue?.sprintId === sprint?.id,
          );
          const otherSprints = sprints?.filter(({ id }) => id !== sprint?.id);

          return (
            <KanbanBoard
              key={sprint?.id}
              name={sprint?.name}
              columns={columns}
              issues={sprintIssues}
              otherSprints={otherSprints}
              sprintId={sprint?.id}
              onSendIssueToBottomOfBacklog={onSendIssueToBottomOfBacklog}
              onSendIssueToTopOfBacklog={onSendIssueToTopOfBacklog}
              onSendIssueToSprint={onSendIssueToSprint}
              onUpdateIssues={onUpdateIssues}
              onUpdateIssueOrdinals={issueOrdinals =>
                onUpdateIssueOrdinals(issueOrdinals, sprint?.id)
              }
              setIssueBeingEdited={setIssueBeingEdited}
            />
          );
        })}
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
    </>
  );
};

Board.propTypes = {
  board: PropTypes.objectOf(PropTypes.any).isRequired,
  issues: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
  onSendIssueToBottomOfBacklog: PropTypes.func.isRequired,
  onSendIssueToTopOfBacklog: PropTypes.func.isRequired,
  onSendIssueToSprint: PropTypes.func.isRequired,
  onUpdateIssue: PropTypes.func.isRequired,
  onUpdateIssues: PropTypes.func.isRequired,
  onUpdateIssueOrdinals: PropTypes.func.isRequired,
};

export default Board;
