import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Box } from 'rebass';

import { initialPopoverPosition, inputDateFormat } from 'constants';
import DatePicker from 'components/core/DatePicker';
import TextField from 'components/core/TextField';
import { getFormattedDate } from 'utils/date';

import Styled from './styled';

const DateField = React.forwardRef(
  (
    {
      disabled,
      error,
      label,
      name,
      placeholder,
      required,
      value,
      onChange,
      onClick,
      ...otherProps
    },
    ref,
  ) => {
    const [date, setDate] = useState(getFormattedDate(value, inputDateFormat));
    const [position, setPosition] = useState(initialPopoverPosition);
    const [inputType, setInputType] = useState(date ? 'date' : 'text');

    const containerRef = useRef();
    const initialDate = value && moment(value);
    const open = position.left !== null;

    useEffect(() => {
      const formattedDate = getFormattedDate(value, inputDateFormat);
      setDate(formattedDate);
      setInputType(formattedDate ? 'date' : 'text');
    }, [value]);

    useEffect(() => {
      setInputType(open || value ? 'date' : 'text');
    }, [open]);

    const handleOpen = () => {
      if (containerRef && containerRef.current) {
        const {
          top,
          left,
          height,
        } = containerRef.current.getBoundingClientRect();

        setPosition({
          top: top + height + 18,
          left,
        });
        setInputType('date');
      }
    };

    const handleClose = () => {
      setPosition(initialPopoverPosition);
      if (!date) {
        setInputType('text');
      }
    };

    const handleFocus = () => {
      if (!open) {
        handleOpen();
      }
    };

    const handleSelectDate = selectedDate => {
      if (disabled) {
        return;
      }

      const dateAsIsoString = selectedDate.toISOString();

      onChange(dateAsIsoString);
      handleClose();

      if (!date) {
        setInputType('text');
      }
    };

    const handleClick = () => {
      if (disabled) {
        handleOpen();
        return;
      }

      handleOpen();
    };

    const handleChange = dateValue => {
      if (!dateValue) {
        setDate('');
        setInputType('text');
        onChange('');
        return;
      }

      const now = moment();
      const valueAsMoment = moment(dateValue, inputDateFormat, true);
      const isValid =
        valueAsMoment.isValid() && valueAsMoment.isAfter(now, 'days');

      if (isValid) {
        const dateAsIsoString = valueAsMoment.toISOString();
        onChange(dateAsIsoString);
      }

      setDate(dateValue);
    };

    const handleClear = () => {
      setDate('');
      setInputType('text');
      onChange('');
    };

    const formattedValue =
      inputType === 'date' ? date : getFormattedDate(value, 'DD/MM/YYYY');

    return (
      <>
        <Styled.Container ref={containerRef} alignItems="flex-end">
          <Box flex="1" order="1">
            <TextField
              ref={ref}
              type={inputType}
              name={name}
              label={label}
              placeholder={placeholder}
              value={formattedValue}
              selected={open}
              disabled={disabled}
              clearable
              required={required}
              error={error}
              onClear={handleClear}
              onClick={handleClick}
              onFocus={handleFocus}
              onChange={event => handleChange(event.target.value)}
              {...otherProps}
            />
          </Box>
          <Box width="28px" order="2">
            <Box ml="1">
              <Styled.CalendarIcon onClick={handleClick} />
            </Box>
          </Box>
        </Styled.Container>
        {open && (
          <DatePicker
            open={open}
            disabled={disabled}
            anchorPosition={position}
            initialDate={initialDate}
            containerRef={containerRef}
            onClose={handleClose}
            onSelectDate={handleSelectDate}
          />
        )}
      </>
    );
  },
);

DateField.propTypes = {
  disabled: PropTypes.bool,
  error: PropTypes.string,
  format: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DateField;
