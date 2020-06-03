import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { getMonthIsoWeekDatesMap } from 'utils/date';

import Styled from './styled';

const leftMonthVisibleStyles = {
  position: 'absolute',
  left: '-300px',
};

const Month = React.forwardRef(
  (
    {
      disabled,
      enableOutsideDays = false,
      hoveredDate,
      initialDate,
      initialEndDate,
      initialStartDate,
      isEditEnd,
      isEditStart,
      left,
      month,
      right,
      visible,
      year,
      onClick,
      onHoverDate,
    },
    ref,
  ) => {
    let style = {};
    if (left && visible) {
      style = { ...leftMonthVisibleStyles };
    }

    const isoWeekDatesMap = useMemo(
      () => getMonthIsoWeekDatesMap(month, year),
      [month, year],
    );

    const monthAsMoment = moment().month(month).year(year);

    return (
      <Styled.MonthContainer
        ref={ref}
        left={left && !visible}
        right={right && !visible}
        style={style}
      >
        <div>
          <Styled.MonthHeader>
            {monthAsMoment.format('MMM YYYY')}
          </Styled.MonthHeader>
          <Styled.MonthBody>
            <table>
              <tbody>
                {[...isoWeekDatesMap.keys()].map(isoWeek => (
                  <tr key={isoWeek}>
                    {isoWeekDatesMap.get(isoWeek).map(date => {
                      const now = moment();
                      const show = date.month() === month || enableOutsideDays;
                      const isUnavailableDate = date.isBefore(now, 'day');
                      const isValidDate = show && !isUnavailableDate;

                      const selected =
                        (show &&
                          initialDate &&
                          initialDate.isSame(date, 'day')) ||
                        (!!initialStartDate &&
                          initialStartDate.isSame(date, 'day')) ||
                        (!!initialEndDate &&
                          initialEndDate.isSame(date, 'day'));

                      const isBetweenSelected =
                        isValidDate &&
                        !!initialStartDate &&
                        initialEndDate &&
                        date.isBetween(initialStartDate, initialEndDate);

                      const allowHighlightAfterStart =
                        isEditEnd &&
                        !initialEndDate &&
                        !!hoveredDate &&
                        (hoveredDate.isSame(date, 'day') ||
                          date.isBetween(initialStartDate, hoveredDate));
                      const allowHighlightBeforeEnd =
                        isEditStart &&
                        !initialStartDate &&
                        !!hoveredDate &&
                        (hoveredDate.isSame(date, 'day') ||
                          date.isBetween(hoveredDate, initialEndDate));

                      const isBetweenHovered =
                        isValidDate &&
                        hoveredDate &&
                        (allowHighlightAfterStart || allowHighlightBeforeEnd);

                      return (
                        <Styled.DayOfWeek
                          key={date.unix()}
                          show={show}
                          selected={selected}
                          unavailable={isUnavailableDate}
                          disabled={disabled}
                          isBetweenHovered={isBetweenHovered}
                          isBetweenSelected={isBetweenSelected}
                          onMouseEnter={() => isValidDate && onHoverDate(date)}
                          onMouseLeave={() => isValidDate && onHoverDate(null)}
                          onClick={() => isValidDate && onClick(date)}
                        >
                          {show && date.format('D')}
                        </Styled.DayOfWeek>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Styled.MonthBody>
        </div>
      </Styled.MonthContainer>
    );
  },
);

Month.propTypes = {
  disabled: PropTypes.bool,
  enableOutsideDays: PropTypes.bool,
  hoveredDate: PropTypes.objectOf(PropTypes.any),
  initialDate: PropTypes.objectOf(PropTypes.any),
  initialEndDate: PropTypes.objectOf(PropTypes.any),
  initialStartDate: PropTypes.objectOf(PropTypes.any),
  isEditEnd: PropTypes.bool,
  isEditStart: PropTypes.bool,
  left: PropTypes.number,
  month: PropTypes.number,
  right: PropTypes.number,
  visible: PropTypes.bool,
  year: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  onHoverDate: PropTypes.func.isRequired,
};

export default Month;
