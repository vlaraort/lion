import { html } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { localize, getWeekdayNames, getMonthNames, isSameDay } from '@lion/localize';
import { createMonth } from './utils/createMonth.js';
import { headerTemplate } from './utils/headerTemplate.js';
import { monthTemplate } from './utils/monthTemplate.js';
import { calendarStyles } from './calendarStyles.js';

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
      weekdaysAbbreviations: getWeekdayNames({
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
    return month;
  }

  _dayPreprocessor(day) {
    let processedDay = day;
    processedDay.disabled = day.date.getMonth() !== this.focusDate.getMonth();
    processedDay.selected = isSameDay(day.date, this.selectedDate);
    // call custom dayPreprocessor
    processedDay = this.dayPreprocessor(processedDay);
    return processedDay;
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

    if (name === 'selectedDate') {
      this.focusDate = this.selectedDate;
    }
    if (name === 'focusDate') {
      if (!this.isValidFocusDate(this.focusDate)) {
        this.focusDate = this.findBestValidFocusDateFor(this.focusDate);
      }
    }

    if (updateDataOn.includes(name) && this._monthsData.weeks) {
      this._monthsData = this.createMonth();
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
          previousMonth: this.previousMonth,
        })}
        ${monthTemplate(this._monthsData, {
          focusDate: this.focusDate,
          weekdaysAbbreviations: this._i18n.weekdaysAbbreviations,
          weekdays: this._i18n.weekdays,
        })}
      </div>
    `;
  }
}
