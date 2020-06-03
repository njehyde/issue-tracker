import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  grid-template-areas:
    'header header header'
    'content content content'
    'footer footer footer';
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
`;

const Header = styled.div`
  grid-area: header;
`;

const Main = styled.div`
  grid-area: content;
  height: 100%;
`;

const Footer = styled.div`
  grid-area: footer;
`;

export default {
  Container,
  Header,
  Main,
  Footer,
};
