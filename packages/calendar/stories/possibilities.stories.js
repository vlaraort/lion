import { storiesOf, html } from '@open-wc/demoing-storybook';

import { LionCalendar } from '../index.js';

storiesOf('Calendar|Extension Possibilities', module).add('2 Month POC', () => {
  class TwoMonth extends LionCalendar {
    constructor() {
      super();
      this.__futureMonths = 1;
      this.__pastMonths = 0;
    }

    createData() {
      return super.createData({ futureMonths: this.__futureMonths, pastMonths: this.__pastMonths });
    }

    modifyDate(modify, { type = 'Date', mode = 'future', dateType = 'centralDate' } = {}) {
      let tmpDate = new Date(this.centralDate);
      tmpDate[`set${type}`](tmpDate[`get${type}`]() + modify);

      if (!this.isEnabledDate(tmpDate)) {
        tmpDate = this.findBestEnabledDateFor(tmpDate, { mode });
      }

      if (mode === 'future' && tmpDate.getMonth() === this.centralDate.getMonth() + 1) {
        this.__futureMonths = 0;
        this.__pastMonths = 1;
      }

      if (mode === 'past' && tmpDate.getMonth() === this.centralDate.getMonth() - 1) {
        this.__futureMonths = 1;
        this.__pastMonths = 0;
      }

      this[dateType] = tmpDate;
    }
  }

  customElements.define('two-month', TwoMonth);

  return html`
    <style>
      .wrapper {
        width: 300px;
        border: 1px solid #adadad;
        box-shadow: 0 0 16px #ccc;
      }
    </style>

    <div class="wrapper">
      <two-month></two-month>
    </div>
  `;
});
