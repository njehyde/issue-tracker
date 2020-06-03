import styled, { css } from 'styled-components';

// const defaultColor = rgba(47, 79, 79, 1);
// const primaryColor = rgba(0, 136, 169, 1);
// const successColor = rgba(46, 204, 113);
// const warningColor = rgba(247, 127, 0, 1);
// const dangerColor = 'rgba(255, 22, 84, 1)';
// const neutralColor = 'rgba(255, 255, 255, 1)';

export const Button = styled.button`
  font-size: inherit;
  background: transparent;
  border-radius: 3px;
  font-family: 'Montserrat', sans-serif;
  border: 1px solid ${props =>
    props.theme.colors.border.default}; // rgba(149, 165, 166, 1)
  color: rgba(36, 37, 42, 1);
  padding: 0.375rem 0.75rem;
  transition: all 0.2s ease 0s;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
    background: ${props =>
      props.theme.colors.background.default}; // rgba(47, 79, 79, 1)
    border-color: ${props =>
      props.theme.colors.background.default}; // rgba(47, 79, 79, 1)
    color: rgba(255, 255, 255, 1);
  }
  &:focus {
    box-shadow: 0 0 0 0.2rem ${props =>
      props.theme.colors.boxShadow.default}; // rgba(47, 79, 79, 0.5)
    outline: 0;
  }
  
  ${props =>
    props.active &&
    css`
      background: ${props.theme.colors.background
        .default}; // rgba(47, 79, 79, 1)
      border-color: ${props.theme.colors.background
        .default}; // rgba(47, 79, 79, 1)
      color: rgba(255, 255, 255, 1);
    `}

  ${props =>
    props.invert &&
    css`
      background: ${props.theme.colors.background
        .default}; // rgba(47, 79, 79, 1)
      color: rgba(255, 255, 255, 1);
      &:hover {
        background: rgba(255, 255, 255, 1);
        color: ${props.theme.colors.background.default}; // rgba(47, 79, 79, 1)
      }
    `}
  ${props =>
    props.active &&
    props.invert &&
    css`
      background: rgba(255, 255, 255, 1);
      color: ${props.theme.colors.background.default}; // rgba(47, 79, 79, 1)
    `}

  ${props =>
    props.primary &&
    css`
      border-color: ${props.theme.colors.border
        .primary}; // rgba(0, 136, 169, 1)
      &:hover {
        border-color: ${props.theme.colors.border
          .primary}; // rgba(0, 136, 169, 1)
      }
      &:focus {
        box-shadow: 0 0 0 0.2rem ${props.theme.colors.boxShadow.primary}; // rgba(0, 136, 169, 0.5)
      }
    `}
  ${props =>
    props.primary &&
    props.active &&
    css`
      border-color: ${props.theme.colors.border
        .primary}; // rgba(0, 136, 169, 1)
    `}

  ${props =>
    props.primary &&
    !props.invert &&
    css`
      background: rgba(255, 255, 255, 1);
      color: ${props.theme.colors.background.primary}; // rgba(0, 136, 169, 1)
      &:hover {
        background: ${props.theme.colors.background
          .primary}; // rgba(0, 136, 169, 1)
        color: rgba(255, 255, 255, 1);
      }
    `}
  ${props =>
    props.primary &&
    !props.invert &&
    props.active &&
    css`
      background: ${props.theme.colors.background
        .primary}; // rgba(0, 136, 169, 1)
      color: rgba(255, 255, 255, 1);
    `}

  ${props =>
    props.primary &&
    props.invert &&
    css`
      background: ${props.theme.colors.background
        .primary}; // rgba(0, 136, 169, 1)
      color: rgba(255, 255, 255, 1);
      &:hover {
        background: rgba(255, 255, 255, 1);
        color: ${props.theme.colors.background.primary}; // rgba(0, 136, 169, 1)
      }
    `}
  ${props =>
    props.primary &&
    props.invert &&
    props.active &&
    css`
      background: rgba(255, 255, 255, 1);
      color: ${props.theme.colors.background.primary}; // rgba(0, 136, 169, 1)
    `}

  ${props =>
    props.icon &&
    css`
      line-height: 0;
      padding: 0.375rem 0.375rem;
    `}
`;

const baseStyles = css`
  color: rgba(36, 37, 42, 1);
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  line-height: 1.4;
`;

const H1 = styled.h1`
  ${baseStyles}
  font-size: 2.5rem;
`;

const H2 = styled.h2`
  ${baseStyles};
  font-size: 2rem;
`;

const H3 = styled.h3`
  ${baseStyles};
  font-size: 1.75rem;
`;

const H4 = styled.h4`
  ${baseStyles};
  font-size: 1.5rem;
`;

const H5 = styled.h4`
  ${baseStyles};
  font-size: 1.25rem;
`;

const H6 = styled.h4`
  ${baseStyles};
  font-size: 1rem;
`;

export const Heading = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
};

const Secondary = styled.div`
  font-size: 0.9rem;
  color: #7a869a;
`;

const Error = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.text.danger};
`;

export const Text = {
  Secondary,
  Error,
};

export const Label = styled.label`
  display: block;
  width: auto;
  text-align: left;
  color: #5e6c84;
  font-family: inherit;
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.6;
  margin: 0 0.375rem 0 0;
`;

export const Required = styled.sup`
  padding: 0 0.15rem;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  color: ${props => props.theme.colors.text.danger};
`;

export const Input = styled.input`
  ${props =>
    css`
      background-clip: padding-box;
      background-color: #f4f5f7;
      border-radius: 0.25rem;
      border: 1px solid #dfe1e6;
      color: #172b4d;
      color: ${props.error && 'tomato'};
      display: block;
      font-family: inherit;
      font-size: 1rem;
      font-style: normal;
      font-weight: 400;
      height: calc(1.5em + 0.5rem + 1.5px);
      line-height: 1;
      margin: 0;
      overflow: visible;
      padding: 0.375rem 0.75rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      width: 100%;
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
        background-color: #fff;
        border-color: rgba(0, 136, 169, 1);
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        `}

      &:hover {
        background-color: #fff;
        border-color: rgba(0, 136, 169, 1);
      }

      &:focus {
        background-color: #fff;
        border-color: rgba(0, 136, 169, 1);
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    `}
`;

export const Select = styled.select`
  display: block;
  overflow: visible;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  background-clip: padding-box;
  color: #172b4d;
  color: ${props => props.error && 'tomato'};
  background-color: #f4f5f7;
  border: 1px solid #dfe1e6;
  border-radius: 0.25rem;
  margin: 0;
  padding: 0.375rem 0.75rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  height: calc(1.5em + 0.5rem + 1.5px);
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f4f5f7 inset !important;
  }

  &:hover {
    background-color: #fff;
    border-color: rgba(0, 136, 169, 1);
  }

  &:focus {
    background-color: #fff;
    border-color: rgba(0, 136, 169, 1);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const Textarea = styled.textarea`
  display: block;
  overflow: visible;
  width: 100%;
  font-family: inherit;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  background-clip: padding-box;
  color: #172b4d;
  color: ${props => props.error && 'tomato'};
  background-color: #f4f5f7;
  border: 1px solid #dfe1e6;
  border-radius: 0.25rem;
  margin: 0;
  padding: 0.75rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  resize: ${props => props.resize || 'vertical'};
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #f4f5f7 inset !important;
  }

  &:hover {
    background-color: #fff;
    border-color: rgba(0, 136, 169, 1);
  }

  &:focus {
    background-color: #fff;
    border-color: rgba(0, 136, 169, 1);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;
