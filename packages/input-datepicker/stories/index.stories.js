import { storiesOf, html } from '@open-wc/demoing-storybook';
import { maxDateValidator, minDateValidator, minMaxDateValidator } from '@lion/validate';

import '../lion-input-datepicker.js';

storiesOf('Forms|Input Datepicker', module)
  .add(
    'Default',
    () => html`
      <lion-input-datepicker label="Date" .modelValue=${new Date('2017/06/15')}>
      </lion-input-datepicker>
    `,
  )
  .add(
    'minDateValidator',
    () => html`
      <lion-input-datepicker
        label="MinDate"
        help-text="Enter a date greater than or equal to today"
        .errorValidators=${[minDateValidator(new Date())]}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'maxDateValidator',
    () => html`
      <lion-input-datepicker
        label="MaxDate"
        help-text="Enter a date smaller than or equal to today"
        .errorValidators=${[maxDateValidator(new Date())]}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'minMaxDateValidator',
    () => html`
      <lion-input-datepicker
        label="MinMaxDate"
        help-text="Enter a date between '2018/05/24' and '2018/06/24'"
        .modelValue=${new Date('2018/05/30')}
        .errorValidators=${[
          minMaxDateValidator({ min: new Date('2018/05/24'), max: new Date('2018/06/24') }),
        ]}
      >
      </lion-input-datepicker>
    `,
  )
  .add(
    'Faulty prefilled',
    () => html`
      <lion-input-datepicker
        label="Date"
        help-text="Faulty prefilled input will be cleared"
        .modelValue=${'foo'}
      >
      </lion-input-datepicker>
    `,
  );
