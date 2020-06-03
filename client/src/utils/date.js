import moment from 'moment';

export const getFormattedDate = (dateString, format = 'DD/MMM/YYYY') => {
  if (!dateString) {
    return '';
  }
  const date = moment(dateString);
  return `${date.format(format)}`;
};

export const getFormattedDateTime = (
  dateString,
  format = 'DD/MMM/YY h:mm A',
) => {
  const date = moment(dateString);
  return `${date.format(format)}`;
};

export const getMonthIsoWeekDatesMap = (month, year) => {
  const isoWeekDatesMap = new Map();

  const firstDayOfMonthAsMoment = moment()
    .date(1)
    .month(month)
    .year(year);

  let isoWeeks = [];
  let firstIsoWeekDay = moment(firstDayOfMonthAsMoment).isoWeekday(1);
  let lastIsoWeekDay = moment(firstDayOfMonthAsMoment).isoWeekday(7);
  while (
    lastIsoWeekDay.month() === month ||
    firstIsoWeekDay.month() === month
  ) {
    isoWeeks = [...isoWeeks, moment(firstIsoWeekDay)];
    firstIsoWeekDay = moment(firstIsoWeekDay).add(1, 'isoWeeks');
    lastIsoWeekDay = moment(lastIsoWeekDay).add(1, 'isoWeeks');
  }

  isoWeeks.forEach(isoWeekMoment => {
    const isoWeek = isoWeekMoment.isoWeek();
    let isoWeekdays = [];

    let prev;
    let counter = 0;
    while (counter < 7) {
      if (!prev) {
        prev = moment(isoWeekMoment);
      } else {
        prev = moment(prev).add(1, 'days');
      }
      isoWeekdays = [...isoWeekdays, moment(prev)];
      counter += 1;
    }

    isoWeekDatesMap.set(isoWeek, isoWeekdays);
  });

  return isoWeekDatesMap;
};

export const isDateInbounds = (date, isStartDate, startDate, endDate) => {
  let inbounds = true;
  if (isStartDate && endDate) {
    inbounds = date.isBefore(endDate, 'days');
  }
  if (!isStartDate && startDate) {
    inbounds = date.isAfter(startDate, 'days');
  }
  return inbounds;
};
