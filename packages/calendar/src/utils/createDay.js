export function createDay(
  date = new Date(),
  { startOfWeek = false, selected = false, otherMonth = false } = {},
) {
  return {
    date,
    startOfWeek,
    selected,
    otherMonth,
  };
}
