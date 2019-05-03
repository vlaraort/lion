import { html, ifDefined } from '@lion/core';

const defaultMonthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// TODO: why so much logic in here? Isn't the goal of the _montsData and preprocessors to provide
// in this?
export function dayTemplate(
  day,
  {
    weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthsLabels = defaultMonthLabels,
  } = {},
) {
  const dayNumber = day.date.getDate();
  const monthName = monthsLabels[day.date.getMonth()];
  const year = day.date.getFullYear();
  const weekDay = weekdays[day.date.getDay()];
  return html`
    <td
      class="calendar__day"
      .disabled=${day.disabled}
      ?disabled=${day.disabled}
      .selected=${day.selected}
      ?selected=${day.selected}
      .focused=${day.focused}
      ?focused=${day.focused}
      .hovered=${day.hovered}
      ?hovered=${day.hovered}
      .past=${day.past}
      ?past=${day.past}
      .today=${day.today}
      ?today=${day.today}
      .future=${day.future}
      ?future=${day.future}
      .previousMonth=${day.previousMonth}
      ?previous-month=${day.previousMonth}
      .currentMonth=${day.currentMonth}
      ?current-month=${day.currentMonth}
      .nextMonth=${day.nextMonth}
      ?next-month=${day.nextMonth}
      .date=${day.date}
    >
      <button
        id=${ifDefined(day.focused ? 'focused-day-button' : undefined)}
        class="calendar__day-button"
        tabindex=${day.focused ? '0' : '-1'}
        aria-label=${`${dayNumber} ${monthName} ${year} ${weekDay}`}
        aria-selected=${day.selected ? 'true' : 'false'}
        aria-current=${ifDefined(day.today ? 'date' : undefined)}
        ?disabled=${day.disabled || day.otherMonth}
        .date=${day.date}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
