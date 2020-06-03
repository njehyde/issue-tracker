import React from 'react';
import PropTypes from 'prop-types';

import { Label, Required, Text, Textarea } from 'components/styled';

const TextareaField = React.forwardRef(
  ({ name, label, required, error, onChange, ...otherProps }, ref) => (
    <>
      <Label htmlFor={name}>
        {label}
        {required && <Required>*</Required>}
      </Label>
      <Textarea
        ref={ref}
        name={name}
        onChange={onChange}
        required={required}
        {...otherProps}
      />
      {error && <Text.Error>{error}</Text.Error>}
    </>
  ),
);

TextareaField.propTypes = {
  error: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

export default TextareaField;
