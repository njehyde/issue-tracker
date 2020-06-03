import React from 'react';
import PropTypes from 'prop-types';

const IconUpArrow = ({ color }) => (
  <svg
    version="1.1"
    id="Highest_1_"
    xmlns="http://www.w3.org/2000/svg"
    width="16px"
    height="16px"
    viewBox="0 0 64 64"
    enableBackground="new 0 0 64 64"
    xmlSpace="preserve"
  >
    <path
      fill={color}
      d="M32,55.963L32,55.963c2.2,0,4-1.8,4-4V12.037c0-2.2-1.8-4-4-4h0c-2.2,0-4,1.8-4,4v39.926
	C28,54.163,29.8,55.963,32,55.963z"
    />
    <path
      fill={color}
      d="M49.593,29.63L49.593,29.63c1.556-1.556,1.556-4.101,0-5.657L34.824,9.204c-1.556-1.556-4.101-1.556-5.657,0
	l0,0c-1.556,1.556-1.556,4.101,0,5.657L43.936,29.63C45.491,31.185,48.037,31.185,49.593,29.63z"
    />
    <path
      fill={color}
      d="M14.241,29.63L14.241,29.63c-1.556-1.556-1.556-4.101,0-5.657L29.01,9.204c1.556-1.556,4.101-1.556,5.657,0
	l0,0c1.556,1.556,1.556,4.101,0,5.657L19.897,29.63C18.342,31.185,15.796,31.185,14.241,29.63z"
    />
  </svg>
);

IconUpArrow.propTypes = {
  color: PropTypes.string.isRequired,
};

export default IconUpArrow;
