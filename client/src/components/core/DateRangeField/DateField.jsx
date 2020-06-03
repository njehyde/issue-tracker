import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { inputDateFormat } from 'constants';
import TextField from 'components/core/TextField';
import { getFormattedDate, isDateInbounds } from 'utils/date';

const DateField = React.forwardRef(
  (
    {
      disabled,
      endDate,
      error,
      format = 'YYYY-MM-DD',
      isStart,
      label,
      name,
      open,
      placeholder,
      required,
      selected,
      startDate,
      value,
      onChange,
      onClick,
    },
    ref,
  ) => {
    const [date, setDate] = useState(getFormattedDate(value, format));
    const [inputType, setInputType] = useState(date ? 'date' : 'text');

    useEffect(() => {
      const formattedDate = getFormattedDate(value, inputDateFormat);
      setDate(formattedDate);
      setInputType(formattedDate ? 'date' : 'text');
    }, [value]);

    useEffect(() => {
      setInputType(open || value ? 'date' : 'text');
    }, [open]);

    const handleChange = dateValue => {
      if (!dateValue) {
        setDate('');
        setInputType('text');
        onChange('');
        return;
      }

      const now = moment();
      const valueAsMoment = moment(dateValue, format, true);
      const isValid =
        valueAsMoment.isValid() && valueAsMoment.isAfter(now, 'days');

      if (isValid) {
        const inbounds = isDateInbounds(
          valueAsMoment,
          isStart,
          startDate,
          endDate,
        );
        if (inbounds) {
          const dateAsIsoString = valueAsMoment.toISOString();
          onChange(dateAsIsoString);
        }
      }

      setDate(dateValue);
    };

    const handleClear = () => {
      if (disabled) {
        return;
      }
      setDate('');
      setInputType('text');
      onChange('');
    };

    return (
      <TextField
        ref={ref}
        type={inputType}
        name={name}
        label={label}
        placeholder={placeholder}
        value={date}
        selected={selected}
        disabled={disabled}
        clearable
        required={required}
        error={error}
        onClear={handleClear}
        onClick={onClick}
        onChange={event => handleChange(event.target.value)}
      />
    );
  },
);

DateField.propTypes = {
  disabled: PropTypes.bool,
  endDate: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.string,
  format: PropTypes.string,
  isStart: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  open: PropTypes.bool,
  placeholder: PropTypes.bool,
  required: PropTypes.bool,
  selected: PropTypes.bool,
  startDate: PropTypes.objectOf(PropTypes.any),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DateField;
