import { html, classMap } from '@lion/core';

export function dayTemplate(day) {
  const classes = { calendar__day: !day.disabled, 'calendar__day--disabled': day.disabled };
  return html`
    <td class=${classMap(classes)} .selected=${day.selected}>
      <button
        class="calendar__day-button"
        tabindex=${day.selected ? '0' : '-1'}
        aria-label=${day.date.getDate()}
        aria-selected=${day.selected ? 'true' : 'false'}
        ?disabled=${day.disabled}
      >
        ${day.date.getDate()}
      </button>
    </td>
  `;
}
