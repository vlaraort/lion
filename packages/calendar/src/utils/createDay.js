export function createDay(date = new Date(), { startOfWeek = false, selected = false } = {}) {
  return {
    date,
    startOfWeek,
    selected,
  };
}
