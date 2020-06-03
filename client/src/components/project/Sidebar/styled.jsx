import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Link = styled(NavLink)`
  padding: 0.75rem 1rem;
  border-radius: 3px;
  display: block;
  text-decoration: none;
  color: #42526e;
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  transition: background-color 140ms ease-in-out, transform 0.2s ease 0s;

  &.is-active,
  &:hover,
  &:focus {
    background-color: #ebecf0;
    // box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  }
  &:hover {
    transform: scale(1.015);
  }
  &:focus {
    outline: none;
  }
`;

export default {
  Link,
};
