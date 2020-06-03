import React from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

import { IssueDropType } from 'constants/issue';

import Styled from './styled';

const StatusOverlay = ({ label, name, sprintId, status, statuses }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: IssueDropType.CARD,
    drop: () => ({ type: IssueDropType.STATUS, name, status, sprintId }),
    canDrop: item => {
      return (
        !statuses.includes(item.status) ||
        (statuses.includes(item.status) && item.sprintId !== sprintId)
      );
    },
    collect: monitor => {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
  });

  const isActive = canDrop && isOver;
  let display = 'none';
  let backgroundColor = 'azure';
  let displayOverlay = false;

  if (isActive) {
    display = 'block';
    displayOverlay = true;
  } else if (canDrop) {
    display = 'block';
    displayOverlay = true;
  }

  if (isOver) {
    backgroundColor = 'lightblue';
  }

  return (
    displayOverlay && (
      <Styled.Overlay ref={drop} style={{ display, backgroundColor }}>
        {label}
      </Styled.Overlay>
    )
  );
};

StatusOverlay.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  sprintId: PropTypes.string,
  status: PropTypes.string,
  statuses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

export default StatusOverlay;
