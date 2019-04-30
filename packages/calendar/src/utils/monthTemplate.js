import { html } from '@lion/core';
import { dayTemplate } from './dayTemplate.js';

export function monthTemplate(month, { weekdaysShort, weekdays, monthsLabels } = {}) {
  return html`
    <table role="grid" aria-readonly="true" class="calendar__grid" aria-labelledby="month_and_year">
      <thead id="calendar__thead">
        <tr>
          ${weekdaysShort.map(
            (header, i) => html`
              <th
                class="calendar__weekday-header"
                scope="col"
                aria-label="${weekdays[i]}"
                id="weekday${i + 1}"
              >
                ${header}
              </th>
            `,
          )}
        </tr>
      </thead>
      <tbody>
        ${month.weeks.map(
          week => html`
            <tr>
              ${week.days.map(day => dayTemplate(day, { weekdaysShort, weekdays, monthsLabels }))}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}
