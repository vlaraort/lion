import { html, classMap } from '@lion/core';

export function dayTemplate(
  day,
  {
    weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    monthsLabels = [
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
    ],
  } = {},
) {
  const classes = { calendar__day: !day.otherMonth, 'calendar__day--other-month': day.otherMonth };
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
    >
      <button
        class="calendar__day-button"
        tabindex=${day.selected ? '0' : '-1'}
        aria-label=${`${dayNumber} ${monthName} ${year} ${weekDay}`}
        aria-selected=${day.selected ? 'true' : 'false'}
        ?disabled=${day.disabled || day.otherMonth}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
