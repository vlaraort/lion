import { css } from '@lion/core';

export const calendarStyles = css`
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
  }

  .calendar__day[selected] > button {
    background: #ccc;
  }

  .calendar__day[focused] > button {
    border: 1px solid #333;
  }

  .calendar__day[today] > button {
    text-decoration: underline;
  }

  .calendar__day[hovered] > button {
    border: 1px solid green;
  }

  .calendar__day-button {
    background-color: #fff;
    border: 1px solid #fff;
  }

  .calendar__day--padding {
  }
  .calendar__day--prev-month {
  }
  .calendar__day--next-month {
  }
`;
