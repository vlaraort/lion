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

export function monthTemplate(
  month,
  { weekdaysAbbreviations, weekdays, dayPreProcessor, focusDate } = {},
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
              ${week.days.map(day => dayTemplate(dayPreProcessor(day, focusDate)))}
            </tr>
          `,
        )}
      </tbody>
    </table>
  `;
}

export function headerTemplate(focusDate, { monthsLabels, previousMonth, nextMonth } = {}) {
  return html`
    <div id="calendar__header" class="calendar__header">
      <button
        class="calendar__prev-month-button"
        aria-label="Previous month"
        @click=${previousMonth}
      >
        &lt;
      </button>
      <h2 id="month_and_year" class="calendar__month-heading" aria-live="polite" aria-atomic="true">
        ${monthsLabels[focusDate.getMonth()]} ${focusDate.getFullYear()}
      </h2>
      <button class="calendar__next-month-button" aria-label="Next month" @click=${nextMonth}>
        &gt;
      </button>
    </div>
  `;
}
