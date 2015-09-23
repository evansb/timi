let period = (startString, endString) => {
  let start = new Date(startString);
  let end   = new Date(endString);

  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  return {start: start, end: end};
};

let inPeriods = (day, periods) => {
  return periods.filter((period) => (day >= period.start && day <= period.end)).length > 0;
};

let S1_WEEK7  = period('2015-09-28', '2015-10-03');
let S1_WEEK8  = period('2015-10-05', '2015-10-10');
let S1_WEEK9  = period('2015-10-12', '2015-10-17');
let S1_WEEK10 = period('2015-10-19', '2015-10-24');
let S1_WEEK11 = period('2015-10-26', '2015-10-31');
let S1_WEEK12 = period('2015-11-02', '2015-11-07');
let S1_WEEK13 = period('2015-11-09', '2015-11-14');
let DEEPAVALI = period('2015-11-10', '2015-11-10');

let ODD_WEEKS = [S1_WEEK7, S1_WEEK9, S1_WEEK11, S1_WEEK13];
let EVEN_WEEKS = [S1_WEEK8, S1_WEEK10, S1_WEEK12];
let PUBLIC_HOLIDAY = [DEEPAVALI];

let WEEK_TYPE = { EVERY: 'Every Week', ODD: 'Odd Week', EVEN: 'Even Week' };


let inPublicHoliday = (day) => {
  return inPeriods(day, PUBLIC_HOLIDAY);
};

let inOddWeeks = (day) => {
  return inPeriods(day, ODD_WEEKS);
};

let inEvenWeeks = (day) => {
  return inPeriods(day, EVEN_WEEKS);
};

let getWeekText = (day) => {
  if (inPublicHoliday(day)) {
    return [];
  } else if (inOddWeeks(day)) {
    return [ WEEK_TYPE.EVERY, WEEK_TYPE.ODD ];
  } else if (inEvenWeeks(day)) {
    return [ WEEK_TYPE.EVERY, WEEK_TYPE.EVEN ];
  } else {
    return [];
  }
};

export default getWeekText;
