export const keyCodes = {
  pageup: 33,
  pagedown: 34,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

export const weekdaysShort = {
  'en-GB': {
    Sunday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
};
export const weekdays = {
  'en-GB': {
    Sunday: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },
};

/**
 * Abstraction around calendar day DOM structure,
 * allows for writing readable, 'DOM structure agnostic' tests
 */
export class DayObject {
  constructor(dayEl) {
    this.el = dayEl;
  }

  /**
   * Node references
   */

  button() {
    return this.el.querySelector('button');
  }

  /**
   * States
   */

  get disabled() {
    return this.el.hasAttribute('disabled');
  }

  get selected() {
    return this.el.hasAttribute('selected');
  }

  get current() {
    return this.el.hasAttribute('disabled');
  }

  get focused() {
    return this.el.hasAttribute('focused');
  }

  get hovered() {
    return this.el.hasAttribute('hovered');
  }

  get monthday() {
    return Number(this.el.textContent);
  }

  get weekday() {
    const weekdayEls = this.el.closest('tr').querySelectorAll('.calendar__day');
    const dayIndex = weekdayEls.indexOf(this.el);
    return weekdaysShort['en-GB'].Sunday[dayIndex];
  }
}

/**
 * Abstraction around calendar DOM structure,
 * allows for writing readable, 'DOM structure agnostic' tests
 */
export class CalendarObject {
  constructor(calendarEl) {
    this.el = calendarEl;
  }

  /**
   * Node references
   */

  header() {
    return this.el.shadowRoot.querySelector('.calendar__header');
  }

  monthHeading() {
    return this.el.shadowRoot.querySelector('.calendar__header .calendar__month-heading');
  }

  nextMonthButton() {
    return this.el.shadowRoot.querySelector('.calendar__next-month-button');
  }

  prevMonthButton() {
    return this.el.shadowRoot.querySelector('.calendar__prev-month-button');
  }

  grid() {
    return this.el.shadowRoot.querySelector('.calendar__grid');
  }

  weekdayHeaders() {
    return [].slice.call(this.el.shadowRoot.querySelectorAll('.calendar__weekday-header'));
  }

  days() {
    return [].slice.call(this.el.shadowRoot.querySelectorAll('.calendar__day'));
  }

  day(monthDayNumber) {
    // Relies on the fact that empty cells don't have .calendar__day class
    return this.el.shadowRoot.querySelectorAll('.calendar__day')[monthDayNumber - 1];
  }

  dayObj(monthDayNumber) {
    return new DayObject(this.day(monthDayNumber));
  }

  dayObjs() {
    return this.days().map(d => new DayObject(d));
  }

  focusedDay() {
    return this.dayObjs.find(d => d.focused);
  }

  focusedDayObj() {
    return this.focusedDay().el;
  }

  /**
   * @desc Applies condition to all days, or days in filter
   *
   * @param {function} condition : condition that should apply for "filter" days
   * - Example: "(dayObj) => dayObj.selected"
   * @param {array|function} filter - month day numbers for which condition should apply.
   * - Example 1: "[15, 20]"
   * - Example 2: "(dayNumber) => dayNumber === 15" (1 based ,not zero based)
   */
  checkForAllDays(condition, filter) {
    return this.days().every((d, i) => {
      const dayObj = new DayObject(d);
      const dayNumber = i + 1;
      let shouldApply = true;
      if (filter !== undefined) {
        shouldApply = filter instanceof Array ? filter.includes(dayNumber) : filter(dayNumber);
      }
      // for instance, should be 'disabled' for the 15th and 20th day
      return !shouldApply || (condition(dayObj) && shouldApply);
    });
  }

  /**
   * States
   */

  get activeMonth() {
    return this.monthHeading().textContent.split(' ')[0];
  }

  get activeYear() {
    return this.monthHeading().textContent.split(' ')[1];
  }
}
