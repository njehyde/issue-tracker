import styled, { css } from 'styled-components';

const Card = styled.div`
  background: #fff;
  border: 0;
  border-radius: 2px;
  box-shadow: 0px 1px 2px 0px rgba(9, 30, 66, 0.25);
  color: #333;
  cursor: move;
  font-size: 14px;
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  position: relative;
  transition: background-color 140ms ease-in-out, border-color 75ms ease-in-out,
    transform 0.2s ease 0s;

  &:hover {
    background: #ebecf0;
    transform: scale(1.015);
    z-index: 100;
  }

  ${props =>
    props.active &&
    css`
      background: #ebecf0;
      transform: scale(1.015);
      z-index: 100;
    `}

  .summary {
    display: block;
    box-sizing: content-box;
    line-height: 1.42857143;
    max-height: 4.28571429em;
    overflow: hidden;
    color: #172b4d;
  }
`;

export default {
  Card,
};
