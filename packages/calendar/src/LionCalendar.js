import { html, LitElement } from '@lion/core';
import {
  localize,
  getWeekdayNames,
  getMonthNames,
  isSameDay,
  getFirstDayNextMonth,
  getLastDayPreviousMonth,
  LocalizeMixin,
} from '@lion/localize';
import { createMonth } from './utils/createMonth.js';
import { monthTemplate } from './utils/monthTemplate.js';
import { calendarStyles } from './calendarStyles.js';
import { dayTemplate } from './utils/dayTemplate.js';

/**
 * @customElement
 */
export class LionCalendar extends LocalizeMixin(LitElement) {
  static get localizeNamespaces() {
    return [
      {
        'lion-calendar': locale => {
          switch (locale) {
            case 'de-AT':
            case 'de-DE':
            case 'de':
              return import('../translations/de.js');
            case 'en-AU':
            case 'en-GB':
            case 'en-US':
            case 'en':
              return import('../translations/en.js');
            default:
              throw new Error(`Unknown locale: ${locale}`);
          }
        },
      },
      ...super.localizeNamespaces,
    ];
  }

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

      // TODO: call dayProcessor. The consumer shouldn't care that it is run before (hence 'pre')
      // render. We could equally well call it postProcessor (after month table built), think
      // processor is enough and clearer for consumer.
      dayPreprocessor: { type: Function },

      /**
       * Weekday that will be displayed in first column of month grid.
       * 0: sunday, 1: monday, 2: tuesday, 3: wednesday , 4: thursday, 5: friday, 6: saturday
       * Default is 0
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
      centralDate: { type: Date },
      hoverDate: { type: Date },
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
    this.centralDate = this.selectedDate;
    /** @property {Date} */
    this.focusDate = null;
    /** @property {Date} */
    this.hoverDate = null;

    this._i18n = {
      weekdays: getWeekdayNames({
        locale: this.locale,
        style: 'long',
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      weekdaysShort: getWeekdayNames({
        locale: this.locale,
        style: this.weekdayHeaderNotation,
        firstDayOfWeek: this.firstDayOfWeek,
      }),
      months: getMonthNames({ locale: this.locale }),
    };

    // TODO: what is prependZero?
    // Answer: meant for prepending day number < 10. This should be fixed in dayProcessor
    this.prependZero = true;
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();

    // TODO: why public?
    this.connected = true;

    // calculate correct focusDate based on user provided enabledDates
    this.focusDate = this.selectedDate;

    // setup data for initial render
    this._monthsData = this.createMonth();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__removeEventDelegations();
  }

  firstUpdated() {
    super.firstUpdated();
    this._days = this.shadowRoot.getElementById('calendar__days');

    this.__addEventDelegationForHoverDate();
    this.__addEventDelegationForClickDate();
    this.__addEventForKeyboardNavigation();
  }

  createMonth() {
    const month = createMonth(this.centralDate, { firstDayOfWeek: this.firstDayOfWeek });
    month.weeks.forEach((week, weeki) => {
      week.days.forEach((day, dayi) => {
        // eslint-disable-next-line no-unused-vars
        let currentDay = month.weeks[weeki].days[dayi];
        currentDay = this._dayPreprocessor(currentDay);
      });
    });

    this._nextMonthDisabled = this.maxDate && getFirstDayNextMonth(this.centralDate) > this.maxDate;
    this._previousMonthDisabled =
      this.minDate && getLastDayPreviousMonth(this.centralDate) < this.minDate;

    return month;
  }

  modifyFocusDay(modify, { type = 'Date' } = {}, dateType = 'focusDate') {
    const tmpDate = new Date(this.centralDate);
    tmpDate[`set${type}`](tmpDate[`get${type}`]() + modify);

    this[dateType] = tmpDate;
  }

  // TODO: rename to _customDayPreprocessor. Confusing to give default preprocessor and custom
  // similar names
  _dayPreprocessor(_day) {
    let day = _day;
    const today = new Date();
    day.central = isSameDay(day.date, this.centralDate);
    day.previousMonth = day.date.getMonth() < this.centralDate.getMonth();
    day.currentMonth = day.date.getMonth() === this.centralDate.getMonth();
    day.nextMonth = day.date.getMonth() > this.centralDate.getMonth();
    day.selected = isSameDay(day.date, this.selectedDate);
    day.focused = this.focusDate ? isSameDay(day.date, this.focusDate) : false;
    day.past = day.date < today;
    day.today = isSameDay(day.date, today);
    day.future = day.date > today;
    day.hovered = this.hoverDate ? isSameDay(day.date, this.hoverDate) : false;
    // call enabledDays
    day.disabled = !this.enabledDates(day.date); // Math.random() > 0.5;

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

  _nextButtonClick() {
    this.modifyFocusDay(1, { type: 'Month' });
  }

  _previousButtonClick() {
    this.modifyFocusDay(-1, { type: 'Month' });
  }

  /**
   * @override
   */
  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    const updateDataOn = [
      'centralDate',
      'focusDate',
      'hoverDate',
      'minDate',
      'maxDate',
      'selectedDate',
      'enabledDates',
    ];

    const map = {
      selectedDate: () => this._selectedDateChanged(),
      centralDate: () => this._centralDateChanged(),
      enabledDates: () => this._enabledDatesChanged(),
      focusDate: () => this._focusDateChanged(),
    };
    if (map[name]) {
      map[name]();
    }

    if (updateDataOn.includes(name) && this.connected) {
      this._monthsData = this.createMonth();
    }
  }

  _enabledDatesChanged() {
    // make sure focusDate is still valid
    this._centralDateChanged();
  }

  _selectedDateChanged() {
    this.centralDate = this.selectedDate;
    // TODO: composed ?
    this.dispatchEvent(new CustomEvent('selected-date-changed', { bubbles: true }));
  }

  _centralDateChanged() {
    if (this.connected && !this.isValidDate(this.centralDate)) {
      this.centralDate = this.findBestValidDateFor(this.centralDate);
    }
  }

  _focusDateChanged() {
    if (this.focusDate) {
      this.centralDate = this.focusDate;
    }
  }

  updated(changed) {
    if (changed.has('focusDate') && this.focusDate) {
      this.shadowRoot.getElementById('focused-day-button').focus();
    }
  }

  // TODO: Why public? See no reason to override...
  isValidDate(date) {
    const processedDay = this._dayPreprocessor({ date });
    return !processedDay.disabled;
  }

  findBestValidDateFor(date) {
    const futureDate =
      this.minDate && this.minDate > date ? new Date(this.minDate) : new Date(date);
    const pastDate = this.maxDate && this.maxDate < date ? new Date(this.maxDate) : new Date(date);

    let i = 0;
    do {
      i += 1;
      futureDate.setDate(futureDate.getDate() + 1);
      pastDate.setDate(pastDate.getDate() - 1);
      if (this.isValidDate(futureDate)) {
        return futureDate;
      }
      if (this.isValidDate(pastDate)) {
        return pastDate;
      }
    } while (i < 3650);

    const year = this.centralDate.getFullYear();
    const month = this.centralDate.getMonth() + 1;
    const day = this.centralDate.getDate();
    throw new Error(
      `Could not find a valid focus date within +/- 3650 day for ${year}/${month}/${day}`,
    );
  }

  headerTemplate() {
    return html`
      <div id="calendar__header" class="calendar__header">
        ${this.previousButtonTemplate()}
        <h2
          id="month_and_year"
          class="calendar__month-heading"
          aria-live="polite"
          aria-atomic="true"
        >
          ${this._i18n.months[this.centralDate.getMonth()]} ${this.centralDate.getFullYear()}
        </h2>
        ${this.nextButtonTemplate()}
      </div>
    `;
  }

  previousButtonTemplate() {
    return html`
      <button
        class="calendar__prev-month-button"
        aria-label=${this.msgLit('lion-calendar:previousMonth')}
        title=${this.msgLit('lion-calendar:previousMonth')}
        @click=${this._previousButtonClick}
        ?disabled=${this._previousMonthDisabled}
      >
        &lt;
      </button>
    `;
  }

  nextButtonTemplate() {
    return html`
      <button
        class="calendar__next-month-button"
        aria-label=${this.msgLit('lion-calendar:nextMonth')}
        title=${this.msgLit('lion-calendar:nextMonth')}
        @click=${this._nextButtonClick}
        ?disabled=${this._nextMonthDisabled}
      >
        &gt;
      </button>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  dayTemplate(...params) {
    return dayTemplate(...params);
  }

  // TODO: why externaluze render fns? Goal of splitting up is making them
  // overridable for sub classers. Also, same names is confusing
  monthTemplate() {
    return monthTemplate(this._monthsData, {
      monthsLabels: this._i18n.months,
      weekdaysShort: this._i18n.weekdaysShort,
      weekdays: this._i18n.weekdays,
      dayTemplate: this.dayTemplate,
    });
  }

  render() {
    return html`
      <div id="calendar" class="calendar">
        ${this.headerTemplate()} ${this.monthTemplate()}
      </div>
    `;
  }

  __addEventDelegationForHoverDate() {
    let timeout;
    const isDayOrButton = el =>
      el.classList.contains('calendar__day') || el.classList.contains('calendar__day-button');

    this.__hoverDateDelegation = this._days.addEventListener('mouseover', ev => {
      if (!timeout) {
        // if we don't pass on the parameters to setTimeout then ev.composedPath() becomes empty
        timeout = setTimeout(
          (el, that) => {
            if (isDayOrButton(el)) {
              that.hoverDate = el.date; // eslint-disable-line no-param-reassign
            } else {
              that.hoverDate = null; // eslint-disable-line no-param-reassign
            }
            timeout = null;
          },
          15,
          ev.composedPath()[0],
          this,
        );
      }
    });

    this.__leaveDaysEvent = this._days.addEventListener('mouseleave', () => {
      setTimeout(() => {
        this.hoverDate = null;
      }, 16); // set after debounced event
    });
  }

  __addEventDelegationForClickDate() {
    const isDayOrButton = el =>
      el.classList.contains('calendar__day') || el.classList.contains('calendar__day-button');
    this.__clickDateDelegation = this._days.addEventListener('click', ev => {
      const el = ev.composedPath()[0];
      if (isDayOrButton(el)) {
        this.selectedDate = el.date;
      }
    });
  }

  __removeEventDelegations() {
    this._days.removeEventListener('mouseover', this.__hoverDateDelegation);
    this._days.removeEventListener('mouseleave', this.__leaveDaysEvent);
    this._days.removeEventListener('click', this.__clickDateDelegation);
    this._days.removeEventListener('keydown', this.__keyNavigationEvent);
  }

  __addEventForKeyboardNavigation() {
    this.__keyNavigationEvent = this._days.addEventListener('keydown', ev => {
      // let hasFocus = true;
      switch (ev.key) {
        case 'ArrowUp':
          this.modifyFocusDay(-7);
          break;
        case 'ArrowDown':
          this.modifyFocusDay(7);
          break;
        case 'ArrowLeft':
          this.modifyFocusDay(-1);
          break;
        case 'ArrowRight':
          this.modifyFocusDay(1);
          break;
        case 'PageDown':
          if (ev.altKey === true) {
            this.modifyFocusDay(1, { type: 'FullYear' });
          } else {
            this.modifyFocusDay(1, { type: 'Month' });
          }
          break;
        case 'PageUp':
          if (ev.altKey === true) {
            this.modifyFocusDay(-1, { type: 'FullYear' });
          } else {
            this.modifyFocusDay(-1, { type: 'Month' });
          }
          break;
        case 'Tab':
          this.focusDate = null;
          break;
        // no default
      }
    });
  }
}
