/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { createMonth } from '../../src/utils/createMonth.js';
import { monthTemplate } from '../../src/utils/monthTemplate.js';
import { dayPreprocessor } from '../../src/utils/dayPreprocessor.js';

import { monthTemplateSnapshot } from './snapshots/monthTemplate.js';

describe('monthTemplate', () => {
  it('renders month table', async () => {
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
      monthTemplate(month, { focusDate: date, weekdaysAbbreviations, weekdays, dayPreprocessor }),
    );

    expect(el).dom.to.equal(monthTemplateSnapshot);
  });
});
