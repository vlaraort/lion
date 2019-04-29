export function createDay(date = new Date(), { startOfWeek = false, selected = false } = {}) {
  return {
    date,
    startOfWeek,
    selected,
  };
}

export function createWeek(date, { firstDayOfWeek = 0 } = {}) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('invalid date provided');
  }
  let weekStartDate = new Date(date);

  const tmpDate = new Date(date);
  while (tmpDate.getDay() !== firstDayOfWeek) {
    tmpDate.setDate(tmpDate.getDate() - 1);
    weekStartDate = new Date(tmpDate);
  }

  const week = {
    days: [],
  };
  for (let i = 0; i < 7; i += 1) {
    if (i !== 0) {
      weekStartDate.setDate(weekStartDate.getDate() + 1);
    }
    week.days.push({
      date: new Date(weekStartDate),
      startOfWeek: i === 0,
    });
  }
  return week;
}

export function createMonth(date, { firstDayOfWeek = 0 } = {}) {
  if (Object.prototype.toString.call(date) !== '[object Date]') {
    throw new Error('invalid date provided');
  }
  const firstDayOfMonth = new Date(date);
  firstDayOfMonth.setDate(1);
  const monthNumber = firstDayOfMonth.getMonth();
  const weekOptions = { firstDayOfWeek };

  const month = {
    weeks: [],
  };

  let nextWeek = createWeek(firstDayOfMonth, weekOptions);
  do {
    month.weeks.push(nextWeek);
    const firstDayOfNextWeek = new Date(nextWeek.days[6].date); // last day of current week
    firstDayOfNextWeek.setDate(firstDayOfNextWeek.getDate() + 1); // make it first day of next week
    nextWeek = createWeek(firstDayOfNextWeek, weekOptions);
  } while (nextWeek.days[0].date.getMonth() === monthNumber);

  return month;
}

// export function createMonths(date, { firstDayOfWeek = 0 } = {}) {}
