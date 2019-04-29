export function dayPreProcessor(day, focusDate = null) {
  const processedDay = day;
  if (focusDate && day.date.getMonth() !== focusDate.getMonth()) {
    processedDay.disabled = true;
  }
  return processedDay;
}
