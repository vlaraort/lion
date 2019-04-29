/* eslint-env mocha */
/* eslint-disable no-unused-expressions, no-template-curly-in-string, no-unused-vars */
import { expect, fixture } from '@open-wc/testing';
import sinon from 'sinon';
import { keyDownOn } from '@polymer/iron-test-helpers/mock-interactions.js';

import { html } from '@lion/core';
import { localize } from '@lion/localize';
import { localizeTearDown } from '@lion/localize/test-helpers.js';

import { CalendarObject, DayObject, keyCodes, weekdayAbbreviations } from './test-utils.js';

import '../lion-calendar.js';

// TODO:
// Disclaimer: these specs are written without running them, and serve as a specific guide
// for implementation. Expect some possible adjustments to make all specs run.
// In particular, check:
// - for "keyDownOn(el, keyCodes.pageup, 'alt');" -> is alt modifier syntax correct?
// - test utils "CalendarObject" and "DayObject" may need some small changes (since not tested out)

describe('<lion-calendar>', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers({ now: 0 }); // set Unix timestamp (0 = beginning of the Unix epoch)
    localizeTearDown();
  });

  afterEach(() => {
    clock.restore();
  });

  it('gets locale by default from document', async () => {
    const el = await fixture(
      html`
        <lion-calendar></lion-calendar>
      `,
    );
    expect(el.locale).to.equal('en-GB');
    expect(el.locale).to.equal(localize.locale);
  });

  describe('Structure', () => {
    it('implements the calendar CSS Module for HTML structure', async () => {
      const el = await fixture(
        html`
          <lion-calendar></lion-calendar>
        `,
      );
      expect(el.querySelector('.calendar')).not.to.equal(null);
      expect(el.querySelector('.calendar__month-heading')).lightDom.to.equal(`
        <button class="calendar__prev-month-button" aria-label="Previous month">&lt;</button>
        <h2
          id="month_and_year"
          class="calendar__month-heading"
          aria-live="polite"
          aria-atomic="true"
        >
          October 2018
        </h2>
        <button class="calendar__next-month-button" aria-label="Next month">&gt;</button>
      `);

      expect(el.querySelector('.calendar__grid thead')).lightDom.to.equal(`
        <tr>
          <th scope="col" aria-label="Monday" id="weekday1">Mo</th>
          <th scope="col" aria-label="Tuesday" id="weekday2">Tu</th>
          <th scope="col" aria-label="Wednesday" id="weekday3">We</th>
          <th scope="col" aria-label="Thursday" id="weekday4">Th</th>
          <th scope="col" aria-label="Friday" id="weekday5">Fr</th>
          <th scope="col" aria-label="Saturday" id="weekday6">Sa</th>
          <th scope="col" aria-label="Sunday" id="weekday7">Su</th>
        </tr>
      `);

      expect(el.querySelector('.calendar__day')).lightDom.to.equal(`
        <button class="calendar__day-button" tabindex="-1" id="day15" aria-labelledby="weekday1 day15 month" aria-selected="false">15</button>
      `);
      /**
       * Note that all day states are tested below
       */
    });

    /**
     * Not in scope:
     * - ability to start weekdays on Sunday instead of Monday
     * - abilitiy to add custom templates: easily switch out header and create a different nav
     */
  });

  describe('Public API', () => {
    it('has property "selectedDate" for the selected date', async () => {
      const el = await fixture(html`
        <lion-calendar .selectedDate="${new Date('2019/06/15')}"></lion-calendar>
      `);
      const elObj = new CalendarObject(el);
      expect(elObj.day(15).selected).to.equal(true);
      expect(elObj.day(16).selected).to.equal(false);
      expect(elObj.day(14).selected).to.equal(false);
      el.selectedDate = new Date('2018/07/15'); // switch month and year
      await el.updateCompleted;
      expect(elObj.day(15).selected).to.equal(false);
    });

    it('sends event "selected-date-changed" on change of selectedDate property', async () => {
      const mySpy = sinon.spy();
      const el = await fixture(html`
        <lion-calendar @selected-date-changed="${() => mySpy()}"></lion-calendar>
      `);
      expect(mySpy.called).to.equal(false);
      el.selectedDate = new Date('2000-12-12');
      expect(mySpy.called).to.equal(true);
    });

    describe('Enabled Dates', () => {
      it('disables all days before "minDate" property', async () => {
        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000-12-31')}"
            .minDate="${new Date('2000-12-09')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.dayObj(1).disabled).to.equal(false);
        [].forEach(elObj.days(), (d, i) => {
          const shouldBeDisabled = i < 8;
          expect(new DayObject(d).disabled).to.equal(shouldBeDisabled);
        });
      });

      it('disables all days after "maxDate" property', async () => {
        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000-12-01')}"
            .maxDate="${new Date('2000-12-09')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.dayObj(10).disabled).to.equal(false);
        elObj.days().forEach((d, i) => {
          const shouldBeDisabled = i > 8;
          expect(new DayObject(d).disabled).to.equal(shouldBeDisabled);
        });
      });

      it('disables all days except the days specified in enabledDates function', async () => {
        const no15th = d => d.getDate() !== 15;
        const el = await fixture(
          html`
            <lion-calendar
              .selectedDate="${new Date('2000-12-01')}"
              .enabledDates=${no15th}
            ></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        elObj.days().forEach((d, i) => {
          const shouldBeDisabled = i === 15 - 1;
          expect(new DayObject(d).disabled).to.equal(shouldBeDisabled);
        });

        el.selectedDate = new Date('2000-11-01'); // When month view updates, it should still work
        await el.updateCompleted;
        elObj.days().forEach((d, i) => {
          const shouldBeDisabled = i === 15 - 1;
          expect(new DayObject(d).disabled).to.equal(shouldBeDisabled);
        });
      });
    });

    /**
     * Nice to have for feature releases:
     * - intialfocusDate: the focused date on opening the calendar
     * - helper fns for disableWeekends and disableHolidays
     */
  });

  describe('Calendar header (month navigation)', () => {
    describe('Title', () => {
      it('contains secondary title displaying the current month and year in focus', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.monthHeading().textContent).to.equal('December 2000');
      });

      it('updates the secondary title when the displayed month/year changes', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        el.selectedDate = new Date('1999-10-12');
        expect(elObj.monthHeading().textContent).to.equal('October 1999');
      });

      describe('Accessibility', () => {
        it('has aria-live="polite" and aria-atomic="true" set on the secondary title', async () => {
          const el = await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);
          expect(elObj.monthHeading().getAttribute('aria-live')).to.equal('polite');
          expect(elObj.monthHeading().getAttribute('aria-atomic')).to.equal('true');
        });
      });
    });

    describe('Navigation', () => {
      it('has a button for navigation to previous month', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2001-01-01')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.prevMonthButton()).not.to.equal(null);
        expect(elObj.monthHeading().textContent).to.equal('January 2001');

        elObj.prevMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('December 2000');

        elObj.prevMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('November 2000');
      });

      it('has a button for navigation to next month', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.nextMonthButton()).not.to.equal(null);
        expect(elObj.monthHeading().textContent).to.equal('December 2000');

        elObj.nextMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('January 2001');

        elObj.nextMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('February 2001');
      });

      it('disables prevMonthButton and nextMonthButton based on disabled days accordingly', async () => {
        const el = await fixture(html`
          <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.monthHeading().textContent).to.equal('December 2000');
        expect(elObj.prevMonthButton().hasAttribute('disabled')).to.equal(false);
        expect(elObj.nextMonthButton().hasAttribute('disabled')).to.equal(false);

        el.minDate = new Date('2000-12-01');
        el.maxDate = new Date('2000-12-31');
        await el.updateCompleted;

        expect(elObj.prevMonthButton().hasAttribute('disabled')).to.equal(true);
        expect(elObj.nextMonthButton().hasAttribute('disabled')).to.equal(true);

        elObj.prevMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('December 2000');

        elObj.prevMonthButton().click();
        await el.updateCompleted;
        expect(elObj.monthHeading().textContent).to.equal('December 2000');
      });

      describe('Accessibility', () => {
        it('navigate buttons have a tooltip with accesible label', async () => {
          // For now, we create the tooltip with a title attribute on the lion layer.
          // On super layers extending lion-calendar, progressive enhancement (replacing those
          // titles with tooltip functionality imperatively) could be applied to achieve
          // proper UX (and a11y?).
          // TODO: reconsider when tooltip in Overlay System finished
          const el = await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(elObj.prevMonthButton().getAttribute('title')).to.equal('Previous Month');
          expect(elObj.nextMonthButton().getAttribute('title')).to.equal('Next Month');
        });
      });
    });
  });

  describe('Calendar body (months view)', () => {
    it('shows the current month belonging to selectedDate', async () => {
      const el = await fixture(
        html`
          <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
        `,
      );
      const elObj = new CalendarObject(el);
      expect(elObj.monthHeading().textContent).to.equal('December 2000');
    });

    it('renders the days of the week as table headers', async () => {
      const el = await fixture(
        html`
          <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
        `,
      );
      const elObj = new CalendarObject(el);
      expect(elObj.weekDayHeaders().map(h => h.textContent)).to.eql(weekdayAbbreviations);
    });

    describe('Day view', () => {
      it('adds "current" modifier to current date(today)', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.checkForAllDays(d => d.focused, [15])).to.equal(true);
      });

      it('adds "selected" modifier to selected date', async () => {
        const el = await fixture(
          html`
            <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        expect(elObj.checkForAllDays(d => d.selected, [12])).to.equal(true);

        el.selectedDate = new Date('2000-12-15');
        await el.updateCompleted;
        expect(elObj.checkForAllDays(d => d.selected, [15])).to.equal(true);
      });

      it('adds "focused" modifier to focused date', async () => {
        const el = await fixture(html`
          <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.checkForAllDays(d => d.focused, [12])).to.equal(true);
      });

      it('adds "disabled" modifier to disabled dates', async () => {
        const el = await fixture(html`
          <lion-calendar
            .selectedDate="${new Date('2000-12-10')}"
            .minDate="${new Date('2000-12-03')}"
            .maxDate="${new Date('2000-12-29')}"
          >
          </lion-calendar>
        `);
        const elObj = new CalendarObject(el);
        expect(elObj.checkForAllDays(d => d.disabled, [1, 2, 30, 31])).to.equal(true);
      });

      it('adds "hovered" modifier to hovered dates', async () => {
        const el = await fixture(
          html`
            <lion-calendar></lion-calendar>
          `,
        );
        const elObj = new CalendarObject(el);
        elObj.day(1).button.dispatchEvent(new Event('mouseover'));
        expect(elObj.day(1).hovered).to.equal(true);
      });
    });

    describe('User Interaction', () => {
      // For implementation, base on: https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/js/dataGrid.js

      describe('Keyboard Navigation', () => {
        it('focused day is reachable via tab (tabindex="0")', async () => {
          const el = await fixture(
            html`
              <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);
          expect(elObj.checkForAllDays(d => d.el.getAttribute('tabindex') === '0', [12])).to.equal(
            true,
          );
        });

        it('non focused days are not reachable via tab (have tabindex="-1")', async () => {
          const el = await fixture(
            html`
              <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDays(
              d => d.el.getAttribute('tabindex') === '-1',
              dayNumber => dayNumber !== 12,
            ),
          ).to.equal(true);
        });

        it('blocks navigation to disabled days', async () => {
          const el = await fixture(html`
            <lion-calendar
              .selectedDate="${new Date('2000-12-31')}"
              .minDate="${new Date('2000-12-09')}"
            >
            </lion-calendar>
          `);
          const elObj = new CalendarObject(el);
          expect(
            elObj.checkForAllDays(
              d => d.el.getAttribute('tabindex') === '-1',
              dayNumber => dayNumber < 9,
            ),
          ).to.equal(true);
        });

        describe('Arrow keys', () => {
          it('navigates (sets focus) to next row item via [arrow down] key', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            keyDownOn(el, keyCodes.down);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(12 + 7);
          });

          it('navigates (sets focus) to previous row item via [arrow up] key', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            keyDownOn(el, keyCodes.up);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(12 - 7);
          });

          it('navigates (sets focus) to previous column item via [arrow left] key', async () => {
            // 2000-12-12 is Tuesday; at 2nd of row
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            keyDownOn(el, keyCodes.left);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(12 - 1);
          });

          it('navigates (sets focus) to next column item via [arrow right] key', async () => {
            // 2000-12-12 is Tuesday; at 2nd of row
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-12')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            keyDownOn(el, keyCodes.right);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(12 + 1);
          });

          it('navigates (sets focus) to next row via [arrow right] key if last item in row', async () => {
            // 2000-12-17 is Sunday; at end of row
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-17')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.focusedDayObj.weekday).to.equal('Su');
            keyDownOn(el, keyCodes.right);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(18);
            expect(elObj.focusedDayObj.weekday).to.equal('Mo');
          });

          it('navigates (sets focus) to previous row via [arrow left] key if first item in row', async () => {
            // 2000-12-11 is Monday; at start of row
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-11')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.focusedDayObj.weekday).to.equal('Mo');
            keyDownOn(el, keyCodes.left);
            await el.updateCompleted;
            expect(elObj.focusedDayObj.monthday).to.equal(10);
            expect(elObj.focusedDayObj.weekday).to.equal('Su');
          });

          it('navigates to next month via [arrow right] key if last day of month', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-31')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            keyDownOn(el, keyCodes.right);
            await el.updateCompleted;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
            expect(elObj.focusedDayObj.monthday).to.equal(1);
          });

          it('navigates to previous month via [arrow left] key if first day of month', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2001-01-01')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
            keyDownOn(el, keyCodes.right);
            await el.updateCompleted;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            expect(elObj.focusedDayObj.monthday).to.equal(1);
          });

          it('navigates to next month via [arrow down] key if last row of month', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2000-12-30')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            keyDownOn(el, keyCodes.down);
            await el.updateCompleted;
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
            expect(elObj.focusedDayObj.monthday).to.equal(6);
          });

          it('navigates to previous month via [arrow up] key if first row of month', async () => {
            const el = await fixture(
              html`
                <lion-calendar .selectedDate="${new Date('2001-01-02')}"></lion-calendar>
              `,
            );
            const elObj = new CalendarObject(el);
            expect(elObj.activeMonth).to.equal('January');
            expect(elObj.activeYear).to.equal('2001');
            keyDownOn(el, keyCodes.up);
            await el.updateCompleted;
            expect(elObj.activeMonth).to.equal('December');
            expect(elObj.activeYear).to.equal('2000');
            expect(elObj.focusedDayObj.monthday).to.equal(26);
          });
        });

        it('navigates through months with [pageup] [pagedown] keys', async () => {
          const el = await fixture(
            html`
              <lion-calendar .selectedDate="${new Date('2001-01-02')}"></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);
          expect(elObj.activeMonth).to.equal('January');
          keyDownOn(el, keyCodes.pageup);
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('December');
          keyDownOn(el, keyCodes.pageup);
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('November');

          keyDownOn(el, keyCodes.pagedown);
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('December');
          keyDownOn(el, keyCodes.pagedown);
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('January');
        });

        it('navigates through years with [alt + pageup] [alt + pagedown] keys', async () => {
          const el = await fixture(
            html`
              <lion-calendar .selectedDate="${new Date('2001-01-02')}"></lion-calendar>
            `,
          );
          const elObj = new CalendarObject(el);
          expect(elObj.activeMonth).to.equal('January');
          keyDownOn(el, keyCodes.pageup, 'alt');
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('December');
          keyDownOn(el, keyCodes.pageup, 'alt');
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('November');

          keyDownOn(el, keyCodes.pagedown, 'alt');
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('December');
          keyDownOn(el, keyCodes.pagedown, 'alt');
          await el.updateCompleted;
          expect(elObj.activeMonth).to.equal('January');
        });
      });

      describe('Initial focus', () => {
        it('focused date is based on "selectedDate"', async () => {
          const elObj = new CalendarObject(
            await fixture(
              html`
                <lion-calendar .selectedDate=${new Date('2019/06/15')}></lion-calendar>
              `,
            ),
          );
          expect(elObj.focusedDayObj.monthday).to.equal(6);
        });

        it('initial focus is on today if no selected date is available', async () => {
          const elObj = new CalendarObject(
            await fixture(
              html`
                <lion-calendar></lion-calendar>
              `,
            ),
          );
          expect(elObj.focusedDayObj.monthday).to.equal(new Date().getDate());
        });

        it('initial focus is on day closest to today, if today (and surrounding dates) is/are disabled', async () => {
          const currentMonthDay = new Date().getDate();
          const disabledRange = [currentMonthDay, currentMonthDay + 1];
          const elObj = new CalendarObject(
            await fixture(
              html`
                <lion-calendar
                  .enabledDates="${d => !disabledRange.includes(d.getDate())}"
                ></lion-calendar>
              `,
            ),
          );
          expect(elObj.focusedDayObj.monthday).not.to.equal(currentMonthDay);
          expect(elObj.focusedDayObj.monthday).to.equal(currentMonthDay - 1);
        });

        it('future dates take precedence over past dates when "distance" between dates is equal', async () => {
          const currentMonthDay = new Date().getDate();
          const elObj = new CalendarObject(
            await fixture(
              html`
                <lion-calendar .enabledDates="${d => d !== currentMonthDay}"></lion-calendar>
              `,
            ),
          );
          expect(elObj.focusedDayObj.monthday).not.to.equal(currentMonthDay);
          expect(elObj.focusedDayObj.monthday).to.equal(currentMonthDay + 1);
        });
      });

      /**
       * Not in scope:
       * - (virtual) scrolling: still under discussion. Wait for UX
       */
    });

    describe('Accessibility', () => {
      // Based on:
      // - https://codepen.io/erikkroes/pen/jJEWpR

      // Navigation and day labels based on:
      // - https://dequeuniversity.com/library/aria/date-pickers/sf-date-picker
      //   (recommended in W3C Editors Draft)

      // For implementation, base on:
      // https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/grid/js/dataGrid.js
      // As an enhancement, we detect when grid boundaries day are exceeded, so we move to
      // next/prev month.

      it(`renders the calendar as a table element with role="grid", aria-readonly="true" and
        a caption (month + year)`, async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        expect(elObj.grid().getAttribute('role')).to.equal('grid');
        expect(elObj.grid().getAttribute('aria-readonly')).to.equal('true');
      });

      it('adds aria-labels to the weekday table headers', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        expect(elObj.weekdayHeaders().map(h => h.getAttribute('aria-label'))).to.eql([
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ]);
      });

      it('renders each day as a button inside a table cell', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        const hasBtn = d => Boolean(d.querySelector('button'));
        expect(elObj.checkForAllDays(hasBtn)).to.equal(true);
      });

      it('renders empty table cells for non existing days', async () => {
        // 2000-11-12 results in: first 2 cells empty and last 3 cells empty
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000-11-12')}"></lion-calendar>
          `),
        );
        const cells = [].slice.call(elObj.grid().querySelectorAll('td'));
        const lastIndex = cells.length;

        // Cell 1 and 2
        expect(cells[0].el.textContent).to.equal('');
        expect(cells[1].el.textContent).to.equal('');
        expect(cells[2].el.textContent).not.to.equal('');

        // Cell lastIndex till (lastIndex -2)
        expect(cells[lastIndex].el.textContent).to.equal('');
        expect(cells[lastIndex - 1].el.textContent).to.equal('');
        expect(cells[lastIndex - 2].el.textContent).to.equal('');
        expect(cells[lastIndex - 3].el.textContent).not.to.equal('');
      });

      it('sets aria-current="date" to current date(today) button', async () => {
        const elObj = new CalendarObject(
          await fixture(
            html`
              <lion-calendar></lion-calendar>
            `,
          ),
        );
        const hasAriaCurrent = d => d.button().getAttribute('aria-current') === 'date';
        const monthday = new Date().getDate();
        expect(elObj.checkForAllDays(hasAriaCurrent, [monthday])).to.equal(true);
      });

      it('sets aria-selected="true" on selected date button', async () => {
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000-11-12')}"></lion-calendar>
          `),
        );
        const hasAriaSelected = d => d.button().getAttribute('aria-selected') === 'true';
        expect(elObj.checkForAllDays(hasAriaSelected, [12])).to.equal(true);
      });

      // This implementation mentions "button" inbetween and doesn't mention table
      // column and row. As an alternative, see Deque implementation below.
      // it(`on focus on a day, the screen reader pronounces "day of the week", "day number"
      //    and "month" (in this order)', async () => {
      //   // implemented by labelelledby referencing row and column names
      //   const el = await fixture('<lion-calendar></lion-calendar>');
      // });

      // Alternative: Deque implementation
      it(`sets aria-label on button, that consists of
        "{day number} {month name} {year} {weekday name}"`, async () => {
        const elObj = new CalendarObject(
          await fixture(html`
            <lion-calendar .selectedDate="${new Date('2000-11-12')}"></lion-calendar>
          `),
        );
        expect(
          elObj.checkForAllDays(
            d =>
              d.button().getAttribute('aria-label') === `${d.monthday} November 2000 ${d.weekday}`,
          ),
        ).to.equal(true);
      });

      /**
       * Not in scope:
       * - reads the new focused day on month navigation"
       */
    });

    /**
     * Not in scope:
     * - show week numbers
     */
  });

  describe('Localization', () => {
    it('displays the right translations according to locale', async () => {
      const el = await fixture(
        html`
          <lion-datepicker></lion-datepicker>
        `,
      );
      /**
       * translate:
       * - weekdays
       * - weekday abbreviations
       * - month names
       */
      // TODO: First get translations from uic-date-input
    });
  });
});
