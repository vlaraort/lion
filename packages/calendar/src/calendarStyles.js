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

  .calendar__day-cell {
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

  .calendar__day-button[today] {
    text-decoration: underline;
  }

  .calendar__day-button[selected] {
    background: #ccc;
  }

  .calendar__day-button[hovered] {
    border: 1px solid green;
  }

  .calendar__day-button[focused] {
    border: 1px solid #9ecaed;
    box-shadow: 0 0 10px #9ecaed;
  }

  .calendar__day-button[disabled] {
    color: #ddd;
  }

  .calendar__day-button[previous-month],
  .calendar__day-button[next-month] {
    color: #eee;
  }
`;
