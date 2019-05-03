import { storiesOf, html } from '@open-wc/demoing-storybook';

import '../lion-calendar.js';

storiesOf('Calendar|Standalone', module)
  .add(
    'default',
    () => html`
      <style>
        .wrapper {
          width: 300px;
          border: 1px solid #adadad;
          box-shadow: 0 0 16px #ccc;
        }
      </style>

      <div class="wrapper">
        <lion-calendar></lion-calendar>
      </div>
    `,
  )
  .add(
    'disabled Sa, Su',
    () => html`
      <style>
        .wrapper {
          width: 300px;
          border: 1px solid #adadad;
          box-shadow: 0 0 16px #ccc;
        }
      </style>

      <div class="wrapper">
        <lion-calendar
          .enabledDates=${day => day.getDay() !== 6 && day.getDay() !== 0}
        ></lion-calendar>
      </div>
    `,
  );
