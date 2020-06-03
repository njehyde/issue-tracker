import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  color: #24252a;
`;

const Item = styled.div`
  width: 450px;
`;

export default {
  Container,
  Header,
  Item,
};
