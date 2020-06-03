import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledListItem = styled.li`
  padding: 6px 16px;
  font-size: 1rem;
  line-height: 1.5;
  white-space: nowrap;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

const MenuItem = ({ children, onClick }) => (
  <StyledListItem onClick={onClick}>{children}</StyledListItem>
);

MenuItem.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func,
};

export default MenuItem;
