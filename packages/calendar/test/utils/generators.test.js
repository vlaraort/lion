import { expect } from '@open-wc/testing';
import { createWeek, createMonth } from '../../src/utils/generators.js';

function compareWeek(obj) {
  for (let i = 0; i < 7; i += 1) {
    // eslint-disable-next-line no-param-reassign
    obj.days[i].date = obj.days[i].date.toISOString();
  }
  return obj;
}

function compareMonth(obj) {
  obj.weeks.forEach((week, weeki) => {
    week.days.forEach((day, dayi) => {
      // eslint-disable-next-line no-param-reassign
      obj.weeks[weeki].days[dayi].date = obj.weeks[weeki].days[dayi].date.toISOString();
    });
  });
  return obj;
}

describe('createWeek', () => {
  it('handles dates on monday', () => {
    // https://www.timeanddate.com/date/weeknumber.html?d1=31&m1=12&y1=2018&w2=&y2=&wncm=1&wncd=1&wncs=4&fdow=0
    expect(compareWeek(createWeek(new Date('2018-12-31')))).to.deep.equal(
      compareWeek({
        // weekNumber: 1,
        // weekYear: 2019,
        // weekStart: new Date('2018-12-31'),
        // weekEnd: new Date('2019-01-06'),
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

  it('handles dates on a different day of the week', () => {
    expect(compareWeek(createWeek(new Date('2019-01-03')))).to.deep.equal(
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

  it('handles different firstDayOfWeek dates', () => {
    // https://www.timeanddate.com/date/weeknumber.html?d1=01&m1=01&y1=2019&w2=&y2=&wncm=1&wncd=1&wncs=4&fdow=3
    expect(compareWeek(createWeek(new Date('2019-01-01'), { firstDayOfWeek: 3 }))).to.deep.equal(
      compareWeek({
        days: [
          { date: new Date('2018-12-26'), startOfWeek: true },
          { date: new Date('2018-12-27'), startOfWeek: false },
          { date: new Date('2018-12-28'), startOfWeek: false },
          { date: new Date('2018-12-29'), startOfWeek: false },
          { date: new Date('2018-12-30'), startOfWeek: false },
          { date: new Date('2018-12-31'), startOfWeek: false },
          { date: new Date('2019-01-01'), startOfWeek: false },
        ],
      }),
    );
  });
});

describe('createMonth', () => {
  it('creates month overviews ', () => {
    expect(compareMonth(createMonth(new Date('2018-12-01')))).to.deep.equal(
      compareMonth({
        weeks: [
          createWeek(new Date('2018-11-26')),
          createWeek(new Date('2018-12-03')),
          createWeek(new Date('2018-12-10')),
          createWeek(new Date('2018-12-17')),
          createWeek(new Date('2018-12-24')),
          createWeek(new Date('2018-12-31')),
        ],
      }),
    );
  });
});
