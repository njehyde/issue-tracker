import styled from 'styled-components';

const Overlay = styled.div`
  background-color: azure;
  z-index: 9;
  margin: 0px;
  width: 100%;
  display: none;
  margin-top: -1px;
  border: solid 2px blue;
  border-radius: 6px;
  border-style: dashed;
  border-spacing: 2px;
  flex: 1 1 auto;
  padding: 0.5rem;
`;

export default {
  Overlay,
};
