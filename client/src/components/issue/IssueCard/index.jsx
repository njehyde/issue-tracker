import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { Flex, Box, Image } from 'rebass';

import Badge from 'components/core/Badge';
import Menu from 'components/core/Menu';
import IssueTypeIcon from 'components/issue/IssueTypeIcon';
import PriorityTypeIcon from 'components/issue/PriorityTypeIcon';
import { IssueDropType } from 'constants/issue';

import Styled from './styled';

const initialPosition = {
  mouseX: null,
  mouseY: null,
};

const IssueCard = ({
  issue,
  menuItems,
  onClick,
  onFindIssue,
  onMoveIssue,
  onUpdateIssue,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const originalIndex = onFindIssue(issue.id, issue.status).index;

  const hasIssueMoved = (dropResult, item) => {
    return (
      dropResult.status !== item.status ||
      dropResult.ordinal !== item.ordinal ||
      dropResult.sprintId !== item.sprintId
    );
  };

  const [{ isDragging }, drag] = useDrag({
    item: {
      id: issue.id,
      type: IssueDropType.CARD,
      status: issue.status,
      ordinal: issue.ordinal,
      sprintId: issue?.sprintId,
      originalIndex,
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const {
        id: droppedId,
        originalIndex: droppedOriginalIndex,
        status,
      } = monitor.getItem();
      const dropResult = monitor.getDropResult();
      const hasMoved = hasIssueMoved(dropResult, item);
      if (!hasMoved) {
        return;
      }

      const didDrop = monitor.didDrop();
      const isDifferentStatus = dropResult?.status !== item.status;

      if (didDrop && item && dropResult) {
        const { type: dropResultType } = dropResult;
        const moveToSprintId =
          issue.sprintId !== dropResult?.sprintId && dropResult?.sprintId;

        if (
          dropResultType === IssueDropType.STATUS &&
          (isDifferentStatus || !!moveToSprintId)
        ) {
          onUpdateIssue(issue?.id, dropResult?.status, moveToSprintId);
        } else if (dropResultType === IssueDropType.CARD) {
          onUpdateIssue(issue?.id, dropResult?.status);
        }
      } else if (!didDrop) {
        onMoveIssue(droppedId, droppedOriginalIndex, status);
      }
    },
  });

  const [, drop] = useDrop({
    accept: IssueDropType.CARD,
    drop: () => ({ ...issue, type: IssueDropType.CARD }),
    canDrop: () => true,
    hover({ id: draggedId, status: draggedStatus }) {
      if (draggedId !== issue.id) {
        const { index: overIndex } = onFindIssue(issue.id, issue.status);
        onMoveIssue(draggedId, overIndex, draggedStatus);
      }
    },
  });

  const handleClick = event => {
    event.preventDefault();
    setPosition({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setPosition(initialPosition);
  };

  const opacity = isDragging ? 0 : 1;
  const open = position.mouseY !== null;

  return (
    <>
      <Styled.Card
        ref={node => drag(drop(node))}
        onContextMenu={menuItems && handleClick}
        style={{ opacity }}
        active={open}
        onClick={() => onClick(issue)}
      >
        <section className="summary">
          {issue?.summary} ({issue.status})
        </section>
        <Flex as="section" flexWrap="nowrap" justifyContent="space-between">
          <Flex
            flex="1 0 auto"
            mr="5px"
            mt="10px"
            sx={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: '10px',
            }}
            alignItems="flex-end"
          >
            <Box mr="2" sx={{ lineHeight: 1.2 }}>
              <IssueTypeIcon type={issue?.type} />
            </Box>
            <Box mr="2" sx={{ lineHeight: 1.2 }}>
              <PriorityTypeIcon priority={issue?.priority} />
            </Box>
            <Box mr="2">
              <Badge>{issue?.points}</Badge>
            </Box>
          </Flex>
          <Flex
            flex="1 1 auto"
            flexDirection="row-reverse"
            alignItems="center"
            mt="10px"
            sx={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginTop: '10px',
            }}
          >
            <Image
              width="24px"
              height="24px"
              src={`https://api.adorable.io/avatars/50/${issue?.assigneeId}`}
              sx={{ borderRadius: '50%' }}
            />
            <Box mr="2">{issue?.projectRef}</Box>
          </Flex>
        </Flex>
      </Styled.Card>
      {open && (
        <Menu
          open={open}
          anchorPosition={
            position.mouseY !== null && position.mouseX !== null
              ? { top: position.mouseY, left: position.mouseX }
              : undefined
          }
          onClose={handleClose}
        >
          {menuItems}
        </Menu>
      )}
    </>
  );
};

IssueCard.propTypes = {
  issue: PropTypes.objectOf(PropTypes.any).isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  onClick: PropTypes.func.isRequired,
  onFindIssue: PropTypes.func.isRequired,
  onMoveIssue: PropTypes.func.isRequired,
  onUpdateIssue: PropTypes.func.isRequired,
};

export default IssueCard;
