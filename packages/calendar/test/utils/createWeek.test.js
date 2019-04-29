import { expect } from '@open-wc/testing';
import { createWeek } from '../../src/utils/createWeek.js';

function compareWeek(obj) {
  for (let i = 0; i < 7; i += 1) {
    // eslint-disable-next-line no-param-reassign
    obj.days[i].date = obj.days[i].date.toISOString();
  }
  return obj;
}

describe('createWeek', () => {
  it('creates week data starting from Sunday by default', () => {
    // https://www.timeanddate.com/date/weeknumber.html?d1=30&m1=12&y1=2018&w2=&y2=&wncm=1&wncd=1&wncs=4&fdow=7
    expect(compareWeek(createWeek(new Date('2018-12-30')))).to.deep.equal(
      compareWeek({
        days: [
          { date: new Date('2018-12-30'), startOfWeek: true },
          { date: new Date('2018-12-31'), startOfWeek: false },
          { date: new Date('2019-01-01'), startOfWeek: false },
          { date: new Date('2019-01-02'), startOfWeek: false },
          { date: new Date('2019-01-03'), startOfWeek: false },
          { date: new Date('2019-01-04'), startOfWeek: false },
          { date: new Date('2019-01-05'), startOfWeek: false },
        ],
      }),
    );
  });

  it('can create week data starting from different day', () => {
    // https://www.timeanddate.com/date/weeknumber.html?d1=31&m1=12&y1=2018&w2=&y2=&wncm=1&wncd=1&wncs=4&fdow=0
    expect(compareWeek(createWeek(new Date('2018-12-31'), { firstDayOfWeek: 1 }))).to.deep.equal(
      compareWeek({
        days: [
          { date: new Date('2018-12-31'), startOfWeek: true },
          { date: new Date('2019-01-01'), startOfWeek: false },
          { date: new Date('2019-01-02'), startOfWeek: false },
          { date: new Date('2019-01-03'), startOfWeek: false },
          { date: new Date('2019-01-04'), startOfWeek: false },
          { date: new Date('2019-01-05'), startOfWeek: false },
          { date: new Date('2019-01-06'), startOfWeek: false },
        ],
      }),
    );
  });
});
