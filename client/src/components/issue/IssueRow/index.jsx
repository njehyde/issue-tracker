import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Image } from 'rebass';

import Badge from 'components/core/Badge';
import Menu from 'components/core/Menu';
import IssueTypeIcon from 'components/issue/IssueTypeIcon';
import PriorityTypeIcon from 'components/issue/PriorityTypeIcon';

import Styled from './styled';

const initialPosition = {
  mouseX: null,
  mouseY: null,
};

const IssueRow = ({ issue, menuItems, onClick }) => {
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

  const open = position.mouseY !== null;

  return (
    <>
      <Styled.Card
        onContextMenu={menuItems && handleClick}
        active={open}
        onClick={onClick}
      >
        <Flex px={3} py={1}>
          <Box flex="1 1 auto" alignSelf="center">
            <Flex alignItems="center">
              <Box pr="1" sx={{ lineHeight: 0 }}>
                <IssueTypeIcon type={issue?.type} />
              </Box>
              <Box px="2">{issue.summary}</Box>
            </Flex>
          </Box>
          <Box>
            <Flex alignItems="center">
              <Box px="2" sx={{ lineHeight: 0 }}>
                <Image
                  width="24px"
                  height="24px"
                  src={`https://api.adorable.io/avatars/50/${issue?.assigneeId}`}
                  sx={{ borderRadius: '50%' }}
                />
              </Box>
              <Box px="2">{issue.projectRef}</Box>
              <Box px="2" sx={{ lineHeight: 0 }}>
                <PriorityTypeIcon priority={issue?.priority} />
              </Box>
              <Box pl="2">
                <Badge>{issue.points}</Badge>
              </Box>
            </Flex>
          </Box>
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

IssueRow.propTypes = {
  issue: PropTypes.objectOf(PropTypes.any).isRequired,
  menuItems: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  onClick: PropTypes.func.isRequired,
};

export default IssueRow;
