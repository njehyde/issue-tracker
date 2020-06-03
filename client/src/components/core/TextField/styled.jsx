import React from 'react';
import styled, { css } from 'styled-components';
import { X } from 'react-feather';

const Root = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 1.5px 1px;
  z-index: 0;
`;

const Inner = styled.div`
  z-index: 2;
  position: relative;
  cursor: text;
`;

const InputStyles = styled.div`
  background-color: #f4f5f7;
  border-radius: 0.25rem;
  border: 1px solid #dfe1e6;
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: 0;
`;

const Input = styled.input`
  ${props =>
    css`
      background: transparent;
      border-radius: 0.25rem;
      border: none;
      color: #172b4d;
      color: ${props.error && 'tomato'};
      font-family: inherit;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      height: calc(2em - 1.5px);
      line-height: 1;
      min-width: 0;
      outline: 0;
      padding: 0.375rem 0.75rem;
      ${props.clearable && 'padding-right: 0px;'}
      position: relative;
      vertical-align: middle;
      width: 100%;
      z-index: 2;
      &::-webkit-autofill,
      &::-webkit-autofill:hover,
      &::-webkit-autofill:focus,
      &::-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #f4f5f7 inset !important;
      }
      &::-webkit-inner-spin-button,
      &::-webkit-calendar-picker-indicator {
        display: none;
        -webkit-appearance: none;
      }

      ${props.selected &&
        `
        ${InputStyles} {
          background-color: #fff;
          border-color: rgba(0, 136, 169, 1);
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        `}

      &:hover ~ ${InputStyles}, &:focus ~ ${InputStyles} {
        background-color: #fff;
        border-color: rgba(0, 136, 169, 1);
      }
      &:focus ~ ${InputStyles} {
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    `}
`;

const ClearIcon = styled(X)`
  color: inherit;
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const ClearButton = styled.button`
  color: rgb(211, 212, 213);
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  display: flex;
  line-height: 1;
  outline: 0;
  &:hover {
    color: #676d73;
  }
`;

const Clearable = props => (
  <ClearButton type="button" {...props}>
    <ClearIcon />
  </ClearButton>
);

const Styled = {
  Inner,
  Input,
  InputStyles,
  Root,
  Clearable,
};

export default Styled;
