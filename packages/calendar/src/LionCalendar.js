import { html } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { localize, getWeekdayNames, getMonthNames, isSameDay } from '@lion/localize';
import { createMonth } from './utils/createMonth.js';
import { headerTemplate } from './utils/headerTemplate.js';
import { monthTemplate } from './utils/monthTemplate.js';
import { calendarStyles } from './calendarStyles.js';
import { getFirstDayNextMonth, getLastDayPreviousMonth } from '../../localize/src/date/helpers.js';

/**
 * @customElement
 */
export class LionCalendar extends LionLitElement {
  static get styles() {
    return [calendarStyles];
  }

  static get properties() {
    return {
      /**
       * The selected date, usually synchronized with datepicker-input
       * Not to be confused with the focused date (therefore not necessarily in active month view)
       */
      selectedDate: { type: Date },
      /**
       * Minimum date. All dates before will be disabled
       */
      minDate: { type: Date },
      /**
       * Maximum date. All dates after will be disabled
       */
      maxDate: { type: Date },
      /**
       * Enabled dates function that is applied for every monthday within the active view
       */
      enabledDates: { type: Function },

      dayPreprocessor: { type: Function },

      /**
       * Weekday that will be displayed in first column of month grid.
       * 0: sunday, 1: monday, 2: tuesday, 3: wednesday , 4: thursday, 5: friday, 6: saturday
       * Default is 0
       * TODO: rename to platform standard like 'firstWeekday'? -> ask Misha
       */
      firstDayOfWeek: { type: Number },
      /**
       * Weekday header notation, based on Intl DatetimeFormat:
       * - 'long' (e.g., Thursday)
       * - 'short' (e.g., Thu)
       * - 'narrow' (e.g., T).
       * Default is 'narrow'
       */
      weekdayHeaderNotation: { type: String },

      // TODO: showWeekNumbers

      locale: { type: String },

      /**
       * The currently focused date in active viewport
       */
      focusDate: { type: Date },
      _monthsData: { type: Object },
    };
  }

  constructor() {
    super();
    // Defaults
    this._monthsData = {};
    this.minDate = null;
    this.maxDate = null;
    this.dayPreprocessor = day => day;
    this.enabledDates = () => true;
    this.firstDayOfWeek = 0;
    this.weekdayHeaderNotation = 'short';
    this.locale = localize.locale;
    this.selectedDate = new Date();
    this.focusDate = this.selectedDate;

    this._firstTimeUpdated = true;

    this._i18n = {
      weekdays: getWeekdayNames({
        locale: this.locale || localize.locale,
        style: 'long',
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      weekdaysShort: getWeekdayNames({
        locale: this.locale || localize.locale,
        style: this.weekdayHeaderNotation,
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      months: getMonthNames({ locale: this.locale || localize.locale }),
    };

    // TODO: what is prependZero?
    this.prependZero = true;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();

    // Triggers render function
    this._monthsData = this.createMonth();
  }

  createMonth() {
    const month = createMonth(this.focusDate, { firstDayOfWeek: this.firstDayOfWeek });
    month.weeks.forEach((week, weeki) => {
      week.days.forEach((day, dayi) => {
        // eslint-disable-next-line no-unused-vars
        let currentDay = month.weeks[weeki].days[dayi];
        currentDay = this._dayPreprocessor(currentDay);
      });
    });

    this._nextMonthDisabled = this.maxDate && getFirstDayNextMonth(this.focusDate) > this.maxDate;
    this._previousMonthDisabled =
      this.minDate && getLastDayPreviousMonth(this.focusDate) < this.minDate;

    return month;
  }

  _dayPreprocessor(_day) {
    let day = _day;
    day.otherMonth = day.date.getMonth() !== this.focusDate.getMonth();
    day.selected = isSameDay(day.date, this.selectedDate);
    day.focused = isSameDay(day.date, this.focusDate);
    // call enabledDays
    day.disabled = !this.enabledDates(day.date);

    if (this.minDate && day.date < this.minDate) {
      day.disabled = true;
    }
    if (this.maxDate && day.date > this.maxDate) {
      day.disabled = true;
    }

    // call custom dayPreprocessor
    day = this.dayPreprocessor(day);
    return day;
  }

  nextMonth() {
    this.focusDate = new Date(this.focusDate.setMonth(this.focusDate.getMonth() + 1));
  }

  previousMonth() {
    this.focusDate = new Date(this.focusDate.setMonth(this.focusDate.getMonth() - 1));
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    const updateDataOn = ['minDate', 'maxDate', 'focusDate', 'selectedDate'];

    const map = {
      selectedDate: () => this._selectedDateChanged(),
      focusDate: () => this._focusDateChanged(),
    };
    if (map[name]) {
      map[name]();
    }

    if (updateDataOn.includes(name) && this._monthsData.weeks) {
      this._monthsData = this.createMonth();
    }
  }

  _selectedDateChanged() {
    this.focusDate = this.selectedDate;
  }

  _focusDateChanged() {
    if (!this.isValidFocusDate(this.focusDate)) {
      this.focusDate = this.findBestValidFocusDateFor(this.focusDate);
    }
  }

  isValidFocusDate(focusDate) {
    const { minDate, maxDate } = this;
    if (maxDate && focusDate > maxDate) {
      return false;
    }
    if (minDate && focusDate < minDate) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  findBestValidFocusDateFor() {
    throw new Error('not yet implemented');
  }

  render() {
    return html`
      <div id="calendar" class="calendar">
        ${headerTemplate(this.focusDate, {
          monthsLabels: this._i18n.months,
          nextMonth: this.nextMonth,
          nextMonthDisabled: this._nextMonthDisabled,
          previousMonth: this.previousMonth,
          previousMonthDisabled: this._previousMonthDisabled,
        })}
        ${monthTemplate(this._monthsData, {
          focusDate: this.focusDate,
          weekdaysShort: this._i18n.weekdaysShort,
          weekdays: this._i18n.weekdays,
        })}
      </div>
    `;
  }
}
