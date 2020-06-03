import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledBadge = styled.span`
  border-radius: 2em;
  color: rgba(51, 51, 51, 0.8);
  background-color: #dfe1e6;
  display: inline-block;
  font-size: 11px;
  font-weight: bold;
  line-height: 1;
  margin: 0;
  min-height: 1em;
  min-width: 1em;
  padding: 4px 7px 4px 7px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-shadow: none;
  white-space: pre-wrap;
  text-transform: lowercase;
`;

const Badge = ({ children }) => <StyledBadge>{children || '-'}</StyledBadge>;

Badge.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Badge;
