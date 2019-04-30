import { html, classMap } from '@lion/core';

export function dayTemplate(day, { weekdays, monthsLabels } = {}) {
  const classes = { calendar__day: !day.otherMonth, 'calendar__day--other-month': day.otherMonth };
  return html`
    <td
      class=${classMap(classes)}
      .selected=${day.selected}
      ?selected=${day.selected}
      .disabled=${day.disabled}
      ?disabled=${day.disabled}
      .focused=${day.focused}
      ?focused=${day.focused}
    >
      <button
        class="calendar__day-button"
        tabindex=${day.selected ? '0' : '-1'}
        aria-label=${`${day.date.getDate()} ${
          monthsLabels[day.date.getMonth()]
        } ${day.date.getFullYear()} ${weekdays[day.date.getDay()]}`}
        aria-selected=${day.selected ? 'true' : 'false'}
        ?disabled=${day.disabled || day.otherMonth}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
