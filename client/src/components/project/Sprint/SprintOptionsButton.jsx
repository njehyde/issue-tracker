import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MoreVertical } from 'react-feather';

import Menu from 'components/core/Menu';
import MenuItem from 'components/core/MenuItem';
import { Button } from 'components/styled';

const initialPosition = {
  mouseX: null,
  mouseY: null,
};

const SprintOptionsButton = ({ sprint, onDeleteSprint, onEditSprint }) => {
  const [position, setPosition] = useState(initialPosition);

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

  const handleEditSprint = () => {
    onEditSprint(sprint);
    handleClose();
  };

  const handleDeleteSprint = () => {
    onDeleteSprint(sprint?.id);
    handleClose();
  };

  const open = position.mouseY !== null;

  return (
    <>
      <Button icon primary active={open} onClick={handleClick}>
        <MoreVertical width="18" height="18" />
      </Button>
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
          <MenuItem onClick={handleEditSprint}>Edit sprint</MenuItem>
          <MenuItem onClick={handleDeleteSprint}>Delete sprint</MenuItem>
        </Menu>
      )}
    </>
  );
};

SprintOptionsButton.propTypes = {
  sprint: PropTypes.objectOf(PropTypes.any).isRequired,
  onDeleteSprint: PropTypes.func.isRequired,
  onEditSprint: PropTypes.func.isRequired,
};

export default SprintOptionsButton;
