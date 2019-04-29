/* eslint-disable no-unused-expressions */
import { expect, fixture, html } from '@open-wc/testing';

import { createMonth, createDay } from '../../src/utils/generators.js';
import { dayTemplate, monthTemplate } from '../../src/utils/templates.js';
import { dayPreProcessor } from '../../src/utils/preProcessors.js';

import { monthTemplateSnapshot } from './snapshots/monthTemplate.js';

describe('templates', () => {
  it('dayTemplate', async () => {
    const day = createDay(new Date('2019-04-19'));
    const el = await fixture(
      html`
        ${dayTemplate(day)}
      `,
    );
    expect(el).dom.to.equal(`
      <td class="calendar__day">
        <button
          class="calendar__day-button"
          tabindex="-1"
          aria-label="19"
          aria-selected="false"
        >
          19
        </button>
      </td>
    `);
  });

  it('monthTemplate', async () => {
    const date = new Date('2018-12-01');
    const month = createMonth(date);
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturaday',
    ];
    const weekdaysAbbreviations = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const el = await fixture(
      monthTemplate(month, { focusDate: date, weekdaysAbbreviations, weekdays, dayPreProcessor }),
    );

    expect(el).dom.to.equal(monthTemplateSnapshot);
  });
});
