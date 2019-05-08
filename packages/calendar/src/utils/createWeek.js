import { createDay } from './createDay.js';

export function createWeek(date, { firstDayOfWeek = 0 } = {}) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('invalid date provided');
  }
  let weekStartDate = new Date(date);

  const tmpDate = new Date(date);
  while (tmpDate.getDay() !== firstDayOfWeek) {
    tmpDate.setDate(tmpDate.getDate() - 1);
    weekStartDate = new Date(tmpDate);
  }

  const week = {
    days: [],
  };
  for (let i = 0; i < 7; i += 1) {
    if (i !== 0) {
      weekStartDate.setDate(weekStartDate.getDate() + 1);
    }
    week.days.push(
      createDay(new Date(weekStartDate), {
        weekOrder: i,
        startOfWeek: i === 0,
      }),
    );
  }
  return week;
}
