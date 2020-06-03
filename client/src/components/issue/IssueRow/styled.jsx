import styled, { css } from 'styled-components';

const Card = styled.div`
  border: 1px solid #dfe1e6;
  margin-top: -1px;
  ${props =>
    props.active &&
    css`
      background-color: #f4f5f7;
    `}

  &:hover {
    background-color: #f4f5f7;
    cursor: move;
  }
`;

export default {
  Card,
};
