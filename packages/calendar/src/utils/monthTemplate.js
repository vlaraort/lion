import { html } from '@lion/core';
import { dayTemplate as defaultDayTemplate } from './dayTemplate.js';

export function monthTemplate(
  month,
  { weekdaysShort, weekdays, monthsLabels, dayTemplate = defaultDayTemplate } = {},
) {
  return html`
    <table
      role="grid"
      data-wrap-cols
      aria-readonly="true"
      class="calendar__grid"
      aria-labelledby="month_and_year"
    >
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
      <tbody id="calendar__days">
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
