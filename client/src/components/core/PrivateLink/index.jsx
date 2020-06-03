import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { AuthContext } from 'contexts/auth';

const PrivateLink = ({ to, children }) => {
  const { user } = useContext(AuthContext);
  return user ? <Link to={to}>{children}</Link> : null;
};

PrivateLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default PrivateLink;
