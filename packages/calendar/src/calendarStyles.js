import { css } from '@lion/core';

export const calendarStyles = css`
  :host {
    display: block;
  }

  .calendar {
    display: block;
  }

  .calendar__header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #adadad;
    padding: 0 8px;
  }

  .calendar__month-heading {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #adadad;
    padding: 0 8px;
  }

  .calendar__prev-month-button {
    background-color: #fff;
    border: 0 none;
  }

  .calendar__next-month-button {
    background-color: #fff;
    border: 0 none;
  }

  .calendar__grid {
    width: 100%;
    padding: 8px 8px;
  }

  .calendar__weekday-header {
  }

  /**
   * Note there are ".calendar__day"s and ".calendar__day-button"s
   * - days should be put on role="cell" (td) elements
   * - day-buttons should be put on role="button" (button) elements
   * - Note that the day contains all states(for styling purposes) and the day-button
   * contains all aria states (aria-current, aria-selected, tabindex etc.)
   */

  .calendar__day {
    text-align: center;
  }

  .calendar__day-button {
    background-color: #fff;
    border: 1px solid #fff;
  }

  .calendar__day-button:focus {
    outline: none;
  }

  .calendar__day-button::-moz-focus-inner {
    border: 0;
  }

  .calendar__day[today] .calendar__day-button {
    text-decoration: underline;
  }

  .calendar__day[selected] .calendar__day-button {
    background: #ccc;
  }

  .calendar__day[hovered] .calendar__day-button {
    border: 1px solid green;
  }

  .calendar__day[focused] .calendar__day-button {
    border: 1px solid #9ecaed;
    box-shadow: 0 0 10px #9ecaed;
  }

  .calendar__day[disabled] .calendar__day-button {
    color: #ddd;
  }

  .calendar__day[previous-month] .calendar__day-button,
  .calendar__day[next-month] .calendar__day-button {
    color: #eee;
  }

  button[tabindex='0'] {
    border: 1px dotted green;
  }
`;
