import { html, classMap, ifDefined } from '@lion/core';

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
  const classes = {
    calendar__day: true,
    'calendar__day--current-month': !day.otherMonth,
    'calendar__day--other-month': day.otherMonth,
  };
  const dayNumber = day.date.getDate();
  const monthName = monthsLabels[day.date.getMonth()];
  const year = day.date.getFullYear();
  const weekDay = weekdays[day.date.getDay()];
  return html`
    <td
      class=${classMap(classes)}
      .selected=${day.selected}
      ?selected=${day.selected}
      .disabled=${day.disabled}
      ?disabled=${day.disabled}
      .focused=${day.focused}
      ?focused=${day.focused}
      .current=${day.current}
      ?current=${day.current}
      .hovered=${day.hovered}
      ?hovered=${day.hovered}
      .date=${day.date}
    >
      <button
        class="calendar__day-button"
        tabindex=${day.selected ? '0' : '-1'}
        aria-label=${`${dayNumber} ${monthName} ${year} ${weekDay}`}
        aria-selected=${day.selected ? 'true' : 'false'}
        aria-current=${ifDefined(day.current ? 'date' : undefined)}
        ?disabled=${day.disabled || day.otherMonth}
        .date=${day.date}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
