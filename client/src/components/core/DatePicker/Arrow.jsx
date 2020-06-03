import React from 'react';
import styled, { css } from 'styled-components';

const StyledSVG = styled.svg`
  ${props =>
    css`
      ${props?.position?.top && props?.position?.left
        ? `display: block;`
        : `display: none;`}
      position: absolute !important;
      width: 20px !important;
      height: 10px !important;
      ${props?.position?.top &&
        `top: ${props?.position?.top - 10}px !important;`}
      ${props?.position?.left &&
        `left: ${props?.position?.left +
          16}px !important;`}
      z-index: 201 !important;
      transition: transform 200ms ease-in-out 0s;
      ${props?.offset && `transform: translateX(${props.offset}px)`};
    `}
`;

const StylePath1 = styled.path`
  fill: rgb(255, 255, 255) !important;
`;

const StylePath2 = styled.path`
  stroke: rgb(219, 219, 219) !important;
  fill: transparent !important;
`;

const Arrow = props => (
  <StyledSVG role="presentation" focusable="false" {...props}>
    <StylePath1 d="M0,10 20,10 10,0z" />
    <StylePath2 d="M0,10 10,0 20,10" />
  </StyledSVG>
);

export default Arrow;
