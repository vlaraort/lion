/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { createMonth } from '../../src/utils/createMonth.js';
import { monthTemplate } from '../../src/utils/monthTemplate.js';
import { dayPreprocessor } from '../../src/utils/dayPreprocessor.js';
import { weekdaysAbbreviations, weekdays } from '../test-utils.js';

// eslint-disable-next-line camelcase
import snapshot_enGB_Sunday_201812 from './snapshots/monthTemplate_en-GB_Sunday_2018-12.js';

describe('monthTemplate', () => {
  it('renders month table', async () => {
    const date = new Date('2018-12-01');
    const month = createMonth(date);
    const el = await fixture(
      monthTemplate(month, {
        focusDate: date,
        weekdaysAbbreviations: weekdaysAbbreviations['en-GB'].Sunday,
        weekdays: weekdays['en-GB'].Sunday,
        dayPreprocessor,
      }),
    );

    expect(el).dom.to.equal(snapshot_enGB_Sunday_201812);
  });
});
