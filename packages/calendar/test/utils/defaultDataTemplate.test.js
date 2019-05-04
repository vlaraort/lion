/* eslint-disable no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { createMonth } from '../../src/utils/createMonth.js';
import { defaultDataTemplate } from '../../src/utils/defaultDataTemplate.js';
import { weekdaysShort, weekdays } from '../test-utils.js';

// eslint-disable-next-line camelcase
import snapshot_enGB_Sunday_201812 from './snapshots/monthTemplate_en-GB_Sunday_2018-12.js';

describe('defaultDataTemplate', () => {
  // tough to update manually? why not snapshot?
  it.skip('renders one month table', async () => {
    const date = new Date('2018/12/01');
    const month = createMonth(date);
    const el = await fixture(
      defaultDataTemplate(month, {
        focusDate: date,
        weekdaysShort: weekdaysShort['en-GB'].Sunday,
        weekdays: weekdays['en-GB'].Sunday,
      }),
    );

    expect(el).dom.to.equal(snapshot_enGB_Sunday_201812);
  });
});
