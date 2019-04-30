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
