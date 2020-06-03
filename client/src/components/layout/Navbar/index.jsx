/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import PrivateLink from 'components/core/PrivateLink';
import { paths } from 'constants/routes';
import { AuthContext } from 'contexts/auth';

import Icon from './Icon';
import Styled from './styled';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const isRegisterScreen = useRouteMatch(paths.REGISTER);

  return (
    <Styled.Header>
      <Styled.Logo>
        <Link to={paths.HOME}>
          <Icon />
        </Link>
      </Styled.Logo>
      <Styled.UserLabel>
        {user && `Hi, ${user?.name?.firstName}`}
      </Styled.UserLabel>
      <nav>
        <Styled.NavLinks>
          <Styled.NavLink>
            <PrivateLink to={paths.LIST_PROJECTS}>Projects</PrivateLink>
          </Styled.NavLink>
        </Styled.NavLinks>
      </nav>
      {user ? (
        <PrivateLink to={paths.LOGOUT}>
          <Styled.Button type="button">Logout</Styled.Button>
        </PrivateLink>
      ) : isRegisterScreen ? (
        <Link to={paths.LOGIN}>
          <Styled.Button type="button">Login</Styled.Button>
        </Link>
      ) : (
        <Link to={paths.REGISTER}>
          <Styled.Button type="button">Register</Styled.Button>
        </Link>
      )}
    </Styled.Header>
  );
};

export default Navbar;
