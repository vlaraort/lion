export function createDay(
  date = new Date(),
  { startOfWeek = false, selected = false, focused = false, otherMonth = false } = {},
) {
  return {
    date,
    startOfWeek,
    selected,
    focused,
    otherMonth,
  };
}
