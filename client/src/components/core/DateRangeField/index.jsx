import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Box } from 'rebass';

import DatePicker from 'components/core/DatePicker';
import { initialPopoverPosition } from 'constants';
import { isDateInbounds } from 'utils/date';

import DateField from './DateField';
import Styled from './styled';

const DateRangeField = ({ disabled, startProps, endProps }) => {
  const [position, setPosition] = useState(initialPopoverPosition);
  const [isEditStart, setIsEditStart] = useState(false);
  const [isEditEnd, setIsEditEnd] = useState(false);

  const containerRef = useRef();

  const initialStartDate = startProps?.value && moment(startProps?.value);
  const initialEndDate = endProps?.value && moment(endProps?.value);

  const open = position.left !== null;

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
    }
  };

  const handleClose = () => {
    setIsEditStart(false);
    setIsEditEnd(false);
    setPosition(initialPopoverPosition);
  };

  const handleSelectDate = selectedDate => {
    if (disabled) {
      return;
    }

    const dateAsIsoString = selectedDate.toISOString();
    const inbounds = isDateInbounds(
      selectedDate,
      isEditStart,
      initialStartDate,
      initialEndDate,
    );

    const { onChange: startDateOnChange } = startProps;
    const { onChange: endDateOnChange } = endProps;

    if (isEditStart) {
      if (!inbounds) {
        endDateOnChange('');
      }
      startDateOnChange(dateAsIsoString);
      setIsEditStart(false);
      setIsEditEnd(true);
    } else if (isEditEnd) {
      setIsEditStart(false);
      if (!inbounds) {
        startDateOnChange(dateAsIsoString);
        endDateOnChange('');
        setIsEditEnd(true);
      } else {
        endDateOnChange(dateAsIsoString);
        setIsEditEnd(false);
        if (initialStartDate) {
          handleClose();
        } else {
          setIsEditStart(true);
        }
      }
    }
  };

  const handleClick = (isStart = true) => {
    if (disabled) {
      handleOpen();
      return;
    }

    if (isStart) {
      setIsEditStart(true);
      setIsEditEnd(false);
    } else {
      setIsEditStart(false);
      setIsEditEnd(true);
    }

    handleOpen();
  };

  return (
    <>
      <Styled.Container ref={containerRef}>
        <Box flex="1" order="1">
          <DateField
            isStart
            open={open}
            endDate={initialEndDate}
            {...startProps}
            selected={isEditStart}
            disabled={startProps.disabled || disabled}
            onClick={() => handleClick(true)}
          />
        </Box>
        <Box width="32px" order="2" alignSelf="flex-end">
          <Box mx="1">
            <Styled.ArrowRightIcon />
          </Box>
        </Box>
        <Box flex="1" order="3">
          <DateField
            isEnd
            open={open}
            startDate={initialStartDate}
            {...endProps}
            selected={isEditEnd}
            disabled={endProps.disabled || disabled}
            onClick={() => handleClick(false)}
          />
        </Box>
        <Box width="28px" order="4" alignSelf="flex-end">
          <Box ml="1">
            <Styled.CalendarIcon onClick={() => handleClick(true)} />
          </Box>
        </Box>
      </Styled.Container>
      {open && (
        <DatePicker
          open={open}
          disabled={disabled}
          anchorPosition={position}
          isEditStart={isEditStart}
          isEditEnd={isEditEnd}
          initialStartDate={initialStartDate}
          initialEndDate={initialEndDate}
          containerRef={containerRef}
          onClose={handleClose}
          onSelectDate={handleSelectDate}
        />
      )}
    </>
  );
};

DateRangeField.propTypes = {
  disabled: PropTypes.bool,
  startProps: PropTypes.objectOf(PropTypes.any),
  endProps: PropTypes.objectOf(PropTypes.any),
};

export default DateRangeField;
