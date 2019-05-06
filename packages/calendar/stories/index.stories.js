import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-calendar.js';

storiesOf('Calendar|Standalone', module)
  .add(
    'default',
    () => html`
      <style>
        .calendar {
          border: 1px solid #adadad;
          box-shadow: 0 0 16px #ccc;
          max-width: 500px;
        }
      </style>

      <lion-calendar class="calendar"></lion-calendar>
    `,
  )
  .add(
    'disabled Sa, Su',
    () => html`
      <style>
        .calendar {
          border: 1px solid #adadad;
          box-shadow: 0 0 16px #ccc;
          max-width: 500px;
        }
      </style>

      <lion-calendar
        class="calendar"
        .enabledDates=${day => day.getDay() !== 6 && day.getDay() !== 0}
      ></lion-calendar>
    `,
  );
