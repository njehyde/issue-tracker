import styled from 'styled-components';

const Button = styled.button`
  margin-left: 20px;
  padding: 9px 25px;
  background-color: rgba(0, 136, 169, 1);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.2s ease 0s, color 0.2s ease 0s,
    transform 0.2s ease 0s;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 1);
    color: rgba(0, 136, 169, 1);
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 30px 10%;
  background-color: #24252a;

  li,
  a,
  button {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #edf0f1;
    text-decoration: none;
  }
`;

const Logo = styled.div`
  margin-right: 0;
  width: 60px;
  height: 60px;

  &:hover {
    cursor: pointer;
  }
`;

const NavLink = styled.li`
  a {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 16px;
    color: #edf0f1;
    text-decoration: none;
  }
`;

const NavLinks = styled.ul`
  list-style: none;

  li {
    display: inline-block;
    padding: 0px 20px;

    a {
      transition: all 0.3s ease 0s;

      &:hover {
        color: #0099a9;
      }
    }
  }
`;

const UserLabel = styled.div`
  font-family: 'Montserrat', sans-serif;
  margin-right: auto;
  margin-left: 3rem;
  color: #ffffff;
`;

export default {
  Button,
  Header,
  Logo,
  NavLink,
  NavLinks,
  UserLabel,
};
