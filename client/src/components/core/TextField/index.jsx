import React from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'rebass';

import { Label, Required, Text } from 'components/styled';

import Styled from './styled';

const TextField = React.forwardRef(
  (
    {
      type = 'text',
      name,
      label,
      value,
      required,
      clearable,
      disabled,
      error,
      onChange,
      onClear,
      ...otherProps
    },
    ref,
  ) => (
    <>
      <Label htmlFor={name}>
        {label}
        {required && <Required>*</Required>}
      </Label>
      <Styled.Root>
        <Styled.Inner />
        <Styled.Input
          ref={ref}
          type={type}
          name={name}
          value={value}
          clearable
          onChange={onChange}
          required={required}
          disabled={disabled}
          {...otherProps}
        />
        <Styled.Inner>
          {clearable && !disabled && (
            <Flex alignItems="center" pr="1" height="100%">
              <Styled.Clearable onClick={onClear} />
            </Flex>
          )}
        </Styled.Inner>
        <Styled.InputStyles />
      </Styled.Root>
      {error && <Text.Error>{error}</Text.Error>}
    </>
  ),
);

TextField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
};

export default TextField;
