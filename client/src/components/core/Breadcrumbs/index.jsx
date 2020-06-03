import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-decoration: none;
  color: rgba(0, 136, 169, 1);
  transition: color 0.2s ease 0s;
  &:hover {
    color: rgba(47, 79, 79, 1);
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  text-decoration: none;
  color: rgba(0, 136, 169, 1);
  padding: 0 0.5rem;
`;

const Breadcrumbs = ({ breadcrumbs }) => (
  <div>
    {breadcrumbs.map((breadcrumb, i) => (
      <span key={breadcrumb.path}>
        <StyledLink to={breadcrumb.path}>{breadcrumb.title}</StyledLink>
        {i < breadcrumbs.length - 1 ? <Divider>/</Divider> : ''}
      </span>
    ))}
  </div>
);

Breadcrumbs.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
};

export default Breadcrumbs;
