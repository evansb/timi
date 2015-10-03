import Moment from 'moment';
import mergeIntervals from './lib/mergeIntervals';
import NUSMods from './vendor/nusmods';
import Promise    from 'bluebird';
import boxIntersect1D from 'box-intersect-1d';
import Boom from 'boom';
import getWeekText from './calendar';


let dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let tz = (new Date().getTimezoneOffset())*60000;

// Definition of interval: a pair(array of length 2) of JS Date object,
//                         their date must be the same, and interval[0] should be less than interval[1]

// External library to use:
// mergeIntervals: https://gist.github.com/vrachieru/5649bce26004d8a4682b
// boxIntersect1D.bipartite: https://www.npmjs.com/package/box-intersect-1d


// Part 1: common functions, which you can make use of

// r should be in format of {date: 'YYYY-MM-DD', start: 'HH:MM', end: 'HH:MM'}
// return the corresponding interval
let generateInterval = (r) => {
  let date = Moment(r.date).format('YYYY-MM-DD');
  let start = new Date(date.concat(' ', r.start));
  let end = new Date(date.concat(' ', r.end));
  if(start.toString() === "Invalid Date" || end.toString() === "Invalid Date" || start >= end) {
    throw new Boom.badRequest('invalid time range');
  }
  return [start, end];
};


// Get the complement of a list of intervals in a day
// input: date should a JS Date object, intervals should be a list of intervals of that date
// other wise this function does not produce correct answer
let reverseIntervals = (date, intervals) => {
  let length = intervals.length;
  let newDate = new Date(date.getTime() + tz);

  let reversedIntervals = [];
  let startOfThisDay = Moment(newDate).startOf('day').toDate();
  let startOfNextDay = Moment(newDate).add(1, 'days').startOf('day').toDate();

  if(length === 0) {
    reversedIntervals.push([startOfThisDay, startOfNextDay]);
  } else {
    if(intervals[0][0] > startOfThisDay) {
      reversedIntervals.push([startOfThisDay, intervals[0][0]]);
    }

    for(var i=1;i < length; i++) {
      let previousEnd = intervals[i-1][1];
      let thisStart = intervals[i][0];
      reversedIntervals.push([previousEnd, thisStart]);
    }

    if(intervals[length-1][1] < startOfNextDay) {
      reversedIntervals.push([intervals[length-1][1], startOfNextDay]);
    }
  }
  return reversedIntervals;
};

// input a pair of intersecting intervals (a pair of pair), output their overlap (a pair)
// it only works for intersecting intervals, if not, output will be wrong
let findIntersection = (overlappingPair) => {
  let maxStart = overlappingPair[0][0] > overlappingPair[1][0] ? overlappingPair[0][0] : overlappingPair[1][0];
  let minEnd = overlappingPair[0][1] > overlappingPair[1][1] ? overlappingPair[1][1] : overlappingPair[0][1];
  return [maxStart, minEnd];
};


// Part 2: functions for NUSMods, you can ignore

let getAllClasses = async (links) => {
  let classes = await Promise.map(links, (link) =>(new NUSMods(link)).scrap());
  let flattened = [].concat.apply([],classes);
  return flattened;
};

let split = (timeString) => {
  return timeString.slice(0,2).concat(':', timeString.slice(2,4));
};

let getClassesInThisDay = (dateString, allClasses) => {
  let date = new Date((new Date(dateString)).getTime() + tz);
  let dayText = dayMap[date.getDay()];
  let weekText = getWeekText(date);
  let intervals = [];

  allClasses.forEach((cls) => {
    if(cls.DayText === dayText && weekText.indexOf(cls.WeekText) >=0) {
      let datetime = {date: date, start: split(cls.StartTime), end: split(cls.EndTime)};
      intervals.push(generateInterval(datetime));
    }
  });

  return mergeIntervals(intervals);
};



// Part 3: main function, to be export

let f = async (duration, ranges, NUSModsLinks, GCs) => {
  // 1. pre-process the input data

  // (a). group ranges by date
  let groupedRanges = {};
  ranges.map((range) => {
    let date = Moment(range.date).format('YYYY-MM-DD');
    if (groupedRanges[date] === undefined) {
      groupedRanges[date] = [];
    }
    groupedRanges[date].push(generateInterval(range));
  });

  // (b) sort and merge ranges to make sure no overlapping
  for (var date in groupedRanges) {
    groupedRanges[date] = mergeIntervals(groupedRanges[date]);
  }

  console.log('after group');
  console.log(groupedRanges);

  // 2. pre-process NUSMods

  let allClasses = await getAllClasses(NUSModsLinks);
  // 3. calculate intervals

  let overlappingPairs = [];

  for (var date in groupedRanges) {
    let input = groupedRanges[date];
    let classInThisDay = getClassesInThisDay(date, allClasses);
    let availableIntervalsInThisDay = reverseIntervals(new Date(date), classInThisDay);
    console.log('class in this day');
    console.log(date);
    console.log(classInThisDay);
    console.log('reversed');
    console.log(availableIntervalsInThisDay);

    // you can follow the above, get GC events in this day, use merged intervals format, and reverse it

    // can use bipartite here because both input and availableIntervalsInThisDay have no overlapping(merged),
    // so their intersections also have no overlapping
    boxIntersect1D.bipartite(input, availableIntervalsInThisDay, function (r, b) {
      overlappingPairs.push([input[r], availableIntervalsInThisDay[b]]);
    });
  }

  let intersections = overlappingPairs.map(findIntersection);

  // 4. padding and splitting
  let finalResult = [];

  intersections.forEach((interval) => {
    let start = interval[0];
    let end = interval[1];
    let numOfSlots = Math.floor((end - start) / duration);
    let padding = (end - start) % duration / 2;
    if (numOfSlots >= 1) {
      let trimmedStart = Moment(start).add(padding, 'milliseconds');
      for (let i = 0; i < numOfSlots; i++) {
        let newStart = Moment(trimmedStart).add(i * duration, 'milliseconds').toDate();
        let newEnd = Moment(trimmedStart).add((i + 1) * duration, 'milliseconds').toDate();
        finalResult.push([newStart, newEnd]);
      }
    }
  });
  return finalResult;
};

//let input = {
//  duration: 3600000,
//  ranges: [
//    {date: '2020-02-03', start:'01:00', end:'23:00'},
//    {date: '2020-02-01', start:'03:00', end:'10:00'},
//    {date: '2020-02-01', start:'05:00', end:'19:00'},
//    {date: '2020-02-01', start:'20:00', end:'20:30'},
//    {date: '2020-01-03', start:'10:00', end:'18:00'}
//  ]
//}
//
//let data = input.ranges;
//let duration = input.duration;
//
//let NUSModsLinks = ['http://modsn.us/racU2', 'http://modsn.us/wzaC7'];

let input = {
  duration: 1800000,
  ranges: [
    // weekdays, same day, overlap
    {date: '2015-09-02', start:'15:00', end:'23:00'},
    {date: '2015-09-02', start:'10:00', end:'16:00'},
    // weekdays, same day, no overlap
    {date: '2015-09-03', start:'15:00', end:'20:00'},
    {date: '2015-09-03', start:'5:00', end:'7:00'},
    {date: '2015-09-03', start:'11:00', end:'11:40'},
    // weekends, should be alright for all ranges, except the one less than one hour
    {date: '2015-09-05', start:'15:00', end:'20:00'},
    {date: '2015-09-05', start:'5:00', end:'7:00'},
    {date: '2015-09-05', start:'11:00', end:'11:40'}
  ]
}

let data = input.ranges;
let duration = input.duration;

let NUSModsLinks = [
  'http://modsn.us/racU2',
  'http://modsn.us/wzaC7',
  'http://modsn.us/srPA6',
  //'http://modsn.us/qwmkt', bad
  'http://modsn.us/zzevJ',
  'http://modsn.us/7JuvW',
  'http://modsn.us/zDqUG'
];

export default f;
