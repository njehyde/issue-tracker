import React from 'react';
import PropTypes from 'prop-types';

const IconDownArrow = ({ color }) => (
  <svg
    version="1.1"
    id="Low_1_"
    xmlns="http://www.w3.org/2000/svg"
    width="16px"
    height="16px"
    viewBox="0 0 64 64"
    enableBackground="new 0 0 64 64"
    xmlSpace="preserve"
  >
    <path
      fill={color}
      d="M32,8.037L32,8.037c-2.2,0-4,1.8-4,4v39.926c0,2.2,1.8,4,4,4h0c2.2,0,4-1.8,4-4V12.037
	C36,9.837,34.2,8.037,32,8.037z"
    />
    <path
      fill={color}
      d="M14.241,34.37L14.241,34.37c-1.556,1.556-1.556,4.101,0,5.657L29.01,54.796c1.556,1.556,4.101,1.556,5.657,0
	l0,0c1.556-1.556,1.556-4.101,0-5.657L19.897,34.37C18.342,32.815,15.796,32.815,14.241,34.37z"
    />
    <path
      fill={color}
      d="M49.593,34.37L49.593,34.37c1.556,1.556,1.556,4.101,0,5.657L34.824,54.796
	c-1.556,1.556-4.101,1.556-5.657,0l0,0c-1.556-1.556-1.556-4.101,0-5.657L43.936,34.37C45.491,32.815,48.037,32.815,49.593,34.37z"
    />
  </svg>
);

IconDownArrow.propTypes = {
  color: PropTypes.string.isRequired,
};

export default IconDownArrow;
