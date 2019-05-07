import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '../lion-calendar.js';

const calendarDemoStyle = css`
  .demo-calendar {
    border: 1px solid #adadad;
    box-shadow: 0 0 16px #ccc;
    max-width: 500px;
  }
`;

storiesOf('Calendar|Standalone', module)
  .add(
    'default',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar"></lion-calendar>
    `,
  )
  .add(
    'selectedDate',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        class="demo-calendar"
        .selectedDate="${new Date('2019/12/09')}"
      ></lion-calendar>
    `,
  )
  .add(
    'minDate',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .minDate="${new Date('2019/12/09')}"></lion-calendar>
    `,
  )
  .add(
    'maxDate',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar class="demo-calendar" .maxDate="${new Date('2019/12/09')}"></lion-calendar>
    `,
  )
  .add(
    'disabled Sa, Su',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        class="demo-calendar"
        .enabledDates=${day => day.getDay() !== 6 && day.getDay() !== 0}
      ></lion-calendar>
    `,
  )
  .add(
    'combined disabled dates',
    () => html`
      <style>
        ${calendarDemoStyle}
      </style>

      <lion-calendar
        class="demo-calendar"
        .enabledDates=${day => day.getDay() !== 6 && day.getDay() !== 0}
        .minDate="${new Date()}"
        .maxDate="${new Date('2019/12/09')}"
      ></lion-calendar>
    `,
  );
