import { html } from '@lion/core';
import { dayTemplate } from './dayTemplate.js';

export function monthTemplate(
  month,
  { weekdaysAbbreviations, weekdays, dayPreprocessor, focusDate } = {},
) {
  return html`
    <table role="grid" aria-readonly="true" class="calendar__grid" aria-labelledby="month_and_year">
      <thead id="calendar__thead">
        <tr>
          ${weekdaysAbbreviations.map(
            (header, i) => html`
              <th scope="col" aria-label="${weekdays[i]}" id="weekday${i + 1}">
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
              ${week.days.map(day => dayTemplate(dayPreprocessor(day, focusDate)))}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}
