import { html } from '@lion/core';

export function dayTemplate(day) {
  return html`
    <td class="calendar__day">
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
