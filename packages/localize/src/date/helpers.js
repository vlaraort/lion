/**
 *
 * @param {Date} day1
 * @param {Date} day2
 */
export function isSameDay(day1, day2) {
  return (
    day1.getDate() === day2.getDate() &&
    day1.getMonth() === day2.getMonth() &&
    day1.getFullYear() === day2.getFullYear()
  );
}

export function getFirstDayNextMonth(date) {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(date.getMonth() + 1);
  return result;
}

export function getLastDayPreviousMonth(date) {
  const prev = new Date(date);
  prev.setDate(1);
  prev.setMonth(date.getMonth() - 1);

  return new Date(prev.getFullYear(), prev.getMonth(), 0);
}
