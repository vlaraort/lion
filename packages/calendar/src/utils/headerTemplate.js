import { html } from '@lion/core';

export function headerTemplate(
  focusDate,
  { monthsLabels, previousMonth, previousMonthDisabled, nextMonth, nextMonthDisabled } = {},
) {
  return html`
    <div id="calendar__header" class="calendar__header">
      <button
        class="calendar__prev-month-button"
        aria-label="Previous month"
        @click=${previousMonth}
        ?disabled=${previousMonthDisabled}
      >
        &lt;
      </button>
      <h2 id="month_and_year" class="calendar__month-heading" aria-live="polite" aria-atomic="true">
        ${monthsLabels[focusDate.getMonth()]} ${focusDate.getFullYear()}
      </h2>
      <button
        class="calendar__next-month-button"
        aria-label="Next month"
        @click=${nextMonth}
        ?disabled=${nextMonthDisabled}
      >
        &gt;
      </button>
    </div>
  `;
}
