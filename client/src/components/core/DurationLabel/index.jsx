import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import useInterval from 'hooks/useInterval';

const getDurationLabel = dateTime => {
  const now = moment();
  const duration = moment.duration(now.diff(dateTime));

  const seconds = Math.round(duration.asSeconds());
  const minutes = Math.round(duration.asMinutes());
  const hours = Math.round(duration.asHours());
  const days = Math.round(duration.asDays());
  const months = Math.round(duration.asMonths());
  const years = Math.round(duration.asYears());

  const getUnitLabel = (unitDuration, unit) =>
    `Updated ${unitDuration} ${unitDuration === 1 ? unit : `${unit}s`} ago`;

  if (seconds < 15) {
    return 'Just now';
  }
  if (seconds < 60) {
    return getUnitLabel(seconds, 'second');
  }
  if (minutes < 60) {
    return getUnitLabel(minutes, 'minute');
  }
  if (hours < 24) {
    return getUnitLabel(hours, 'hour');
  }
  if (days < moment().daysInMonth()) {
    return getUnitLabel(days, 'day');
  }
  if (months < 12) {
    return getUnitLabel(months, 'month');
  }
  return getUnitLabel(years, 'year');
};

const DurationLabel = ({ dateTime, duration = 5000 }) => {
  const dateTimeAsMoment = moment(dateTime);
  const [label, setLabel] = useState(getDurationLabel(dateTimeAsMoment));

  useInterval(() => {
    setLabel(getDurationLabel(dateTimeAsMoment));
  }, duration);

  return <span>{label}</span>;
};

DurationLabel.propTypes = {
  dateTime: PropTypes.objectOf(PropTypes.any).isRequired,
  duration: PropTypes.number,
};

export default DurationLabel;
