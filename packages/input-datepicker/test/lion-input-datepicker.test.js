/* eslint-env mocha */
/* eslint-disable no-unused-expressions, no-template-curly-in-string, no-unused-vars */
// TODO: enable linting again when proper imports can be done
/* eslint-disable */
import { expect, fixture } from '@open-wc/testing';
import { localizeTearDown } from '@lion/localize/test-helpers.js';
import { html } from '@lion/core';
import { ModalDialogController } from '@lion/overlays';
import {
  // enabledDatesValidator,
  maxDateValidator,
  minDateValidator,
  minMaxDateValidator,
} from '@lion/validate';

const enabledDatesValidator = () => {}; // TODO: add to '@lion/validate'

class DatepickerInputObject {
  constructor(el) {
    this.el = el;
  }

  overlay() {
    return this.el.overlayCtrl._container;
  }

  invoker() {
    return this.el.querySelector('button[slot="suffix"]');
  }

  calendar() {
    return this.overlay().querySelector('#calendar');
  }
}

describe('<lion-input-datepicker>', () => {
  beforeEach(() => {
    localizeTearDown();
  });

  describe('Calendar Overlay', () => {
    it('exposes ModalDialogController "overlayCtrl" to display calendar', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker></lion-input-datepicker>
        `,
      );
      expect(el.overlayCtrl instanceof ModalDialogController).to.equal(true);
    });

    it('implements calendar-overlay CSS component', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker></lion-input-datepicker>
        `,
      );
      expect(el.querySelector('calendar-overlay')).not.to.equal(null);
      expect(el.querySelector('calendar-overlay__header')).not.to.equal(null);
      expect(el.querySelector('calendar-overlay__title')).not.to.equal(null);
      expect(el.querySelector('calendar-overlay__close-button')).not.to.equal(null);
    });

    it('activates full screen mode on mobile screens', async () => {
      // TODO: should this be part of globalOverlayController as option?
    });

    it('has a close button, with a tooltip "close"', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker></lion-input-datepicker>
        `,
      );
      // Since tooltip not ready, use title which can be progressively enhanced in extension layers.
      expect(el.querySelector('calendar-overlay__close-button').getAttribute('title')).to.equal(
        'close',
      );
    });

    it('has a default title based on input label', async () => {
      const elObj = new DatepickerInputObject(
        await fixture(
          html`
            <lion-input-datepicker
              label="Pick your date"
              .modelValue="${new Date('2020-02-15')}"
            ></lion-input-datepicker>
          `,
        ),
      );
      expect(elObj.overlay().querySelector('calendar-overlay__title').textContent).to.equal(
        'Pick your date',
      );
    });

    it('can have a custom heading', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker heading="foo"></lion-input-datepicker>
        `,
      );
      const elObj = new DatepickerInputObject(el);
      expect(elObj.overlay().querySelector('calendar-overlay__title').textContent).to.equal('foo');
    });

    /**
     * Not in scope:
     * - focusedDate can be overridden
     */
  });

  describe('Input synchronization', () => {
    it('adds invoker button for calendar overlay as suffix slot that toggles the overlay on click', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker></lion-input-datepicker>
        `,
      );
      const elObj = new DatepickerInputObject(el);
      expect(elObj.invoker()).not.to.equal(null);
      expect(el.overlayCtrl.isShown).to.equal(false);
      elObj.invoker().click();
      expect(el.overlayCtrl.isShown).to.equal(true);
    });

    it('disabled flag also disables the datepicker', async () => {
      const el = await fixture(
        html`
          <lion-input-datepicker disabled></lion-input-datepicker>
        `,
      );
      const elObj = new DatepickerInputObject(el);
      expect(el.overlayCtrl.isShown).to.equal(false);
      elObj.invoker().click();
      expect(el.overlayCtrl.isShown).to.equal(false);
    });

    it('syncs modelValue with lion-calendar', async () => {
      const myDate = new Date('2019/06/15');
      const myOtherDate = new Date('2003/08/18');
      const el = await fixture(
        html`
          <lion-input-datepicker .modelValue="${myDate}"></lion-input-datepicker>
        `,
      );
      const elObj = new DatepickerInputObject(el);
      expect(elObj.calendar().selectedDate).to.equal(myDate);
      elObj.calendar().selectedDate = myOtherDate;
      expect(el.modelValue).to.equal(myOtherDate);
    });

    it('closes the calendar overlay(<lion-datepicker>) on "selected-changed"', async () => {});

    it('closes the calendar on [esc] key', async () => {});

    describe('Accessibility', () => {
      it('has a heading of level 1', async () => {
        const el = await fixture(
          html`
            <lion-input-datepicker heading="foo"></lion-input-datepicker>
          `,
        );
        const elObj = new DatepickerInputObject(el);
        expect(elObj.overlay().querySelector('calendar-overlay__title').tagName).to.equal('H1');
      });

      it('adds accessible label to invoker button', async () => {
        const el = await fixture(
          html`
            <lion-input-datepicker></lion-input-datepicker>
          `,
        );
        const elObj = new DatepickerInputObject(el);
        // TODO: right label txt
        expect(elObj.invoker().getAttribute('aria-label')).to.equal('TODO');
      });

      it('adds aria-haspopup="dialog" and aria-expanded="true" to invoker button', async () => {
        const el = await fixture(
          html`
            <lion-input-datepicker></lion-input-datepicker>
          `,
        );
        const elObj = new DatepickerInputObject(el);
        expect(elObj.invoker().getAttribute('aria-haspopup')).to.equal('dialog');
        expect(elObj.invoker().getAttribute('aria-expanded')).to.equal('true');
      });
    });

    describe('Validators', () => {
      /**
       * Validators are the Application Developer facing API in <lion-input-datepicker>:
       * - setting restrictions on min/max/disallowed dates will be done via validators
       * - all validators will be translated under the hood to enabledDates and passed to
       *   lion-calendar
       */

      // TODO: move to validate/validators
      it('has an enableddDates validator', async () => {
        const disallowed = [new Date('2019/06/15'), new Date('2020/06/15')];
        const el = await fixture(html`
          <lion-input-datepicker
            .errorValidators="${[enabledDatesValidator({ fn: d => disallowed.contains(d) })]}"
          >
          </lion-input-datepicker>
        `);
      });

      it('translates minDateValidator to "minDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const el = await fixture(html`
          <lion-input-datepicker
            .errorValidators=${[minDateValidator({ min: myMinDate })]}>
          </lion-input-date>`);
        const elObj = new DatepickerInputObject(el);
        expect(elObj.calendar().minDate).to.equal(myMinDate);
      });

      it('translates maxDateValidator to "minDate" property', async () => {
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker .errorValidators=${[maxDateValidator({ max: myMaxDate })]}>
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        expect(elObj.calendar().maxDate).to.equal(myMaxDate);
      });

      it('translates minMaxDateValidator to "minDate" and "maxDate" property', async () => {
        const myMinDate = new Date('2019/06/15');
        const myMaxDate = new Date('2030/06/15');
        const el = await fixture(html`
          <lion-input-datepicker
            .errorValidators=${[minMaxDateValidator({ min: myMinDate, max: myMaxDate })]}
          >
          </lion-input-datepicker>
        `);
        const elObj = new DatepickerInputObject(el);
        expect(elObj.calendar().minDate).to.equal(myMinDate);
        expect(elObj.calendar().maxDate).to.equal(myMaxDate);
      });

      /**
       * Not in scope:
       * - min/max attr (like platform has): could be added in future if observers needed
       */
    });
  });
});
