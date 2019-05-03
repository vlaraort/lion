export function createDay(
  date = new Date(),
  {
    central = false,
    startOfWeek = false,
    selected = false,
    focused = false,
    previousMonth = false,
    currentMonth = false,
    nextMonth = false,
    past = false,
    today = false,
    future = false,
    hovered = false,
  } = {},
) {
  return {
    central,
    date,
    startOfWeek,
    selected,
    focused,
    previousMonth,
    currentMonth,
    nextMonth,
    past,
    today,
    future,
    hovered,
  };
}
