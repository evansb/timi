import Moment from 'moment';
import mergeIntervals from './lib/mergeIntervals';
import NUSMods from './vendor/nusmods';
import Promise    from 'bluebird';
import boxIntersect1D from 'box-intersect-1d';


let dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// r should be in format of {date: 'YYYY-MM-DD', start: 'HH:MM', end: 'HH:MM'}
// return a pair of JS Date object, representing an interval
let generateRange = (r) => {
  let start = r.date.concat(' ', r.start);
  let end = r.date.concat(' ', r.end);
  return [new Date(start), new Date(end)];
};

// functions for NUSMods, you can ignore

let getAllClasses = async (links) => {
  let classes = await Promise.map(links, (link) =>(new NUSMods(link)).scrap());
  let flattened = [].concat.apply([],classes);
  return flattened;
};

let split = (timeString) => {
  return timeString.slice(0,2).concat(':', timeString.slice(2,4));
};

let getClassesInThisDay = (dateString, allClasses) => {
  let date = new Date(dateString);
  let day = dayMap[date.getDay()];
  let intervals = [];

  allClasses.forEach((cls) => {
    if(cls['DayText'] === day) {
      let datetime = {date: dateString, start: split(cls.StartTime), end: split(cls.EndTime)};
      intervals.push(generateRange(datetime));
    }
  });

  return mergeIntervals(intervals);
}

let reverseIntervals = (date, intervals) => {
  let length = intervals.length;

  let reversedIntervals = [];
  let startOfThisDay = Moment(date).startOf('day').toDate();
  let startOfNextDay = Moment(date).add(1, 'days').startOf('day').toDate();

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
}

// [['2020-01-01 10:00', '2020-01-01 14:00'], ['2020-01-01 12:00', '2020-01-01 18:00']]
// => [['2020-01-01 12:00', '2020-01-01 14:00']]
// All strings above are JS Data objects, I just use strings to explain what does this function do
let findIntersection = (overlappingPair) => {
  let maxStart = overlappingPair[0][0] > overlappingPair[1][0] ? overlappingPair[0][0] : overlappingPair[1][0];
  let minEnd = overlappingPair[0][1] > overlappingPair[1][1] ? overlappingPair[1][1] : overlappingPair[0][1];
  return [maxStart, minEnd];
};

let f = async (duration, ranges, NUSModsLinks, GCs) => {

  // 1. pre-process the input data

  // (a). group ranges by date
  let groupedRanges = {};
  ranges.map((range) => {
    let date = Moment(range.date).format('YYYY-MM-DD');
    if(groupedRanges[date] === undefined) {
      groupedRanges[date] = [];
    }
    groupedRanges[date].push(generateRange(range));
  });

  // (b) sort and merge ranges to make sure no overlapping
  for(var date in groupedRanges) {
    groupedRanges[date] = mergeIntervals(groupedRanges[date]);
  }

  // 2. pre-process NUSMods

  let allClasses = await getAllClasses(NUSModsLinks);

  // 3. calculate intervals

  let overlappingPairs = [];

  for(var date in groupedRanges) {
    let input = groupedRanges[date];
    let classInThisDay = getClassesInThisDay(date, allClasses);
    let availableIntervalsInThisDay = reverseIntervals(new Date(date), classInThisDay);
    boxIntersect1D.bipartite(input, availableIntervalsInThisDay, function(r, b) {
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
      if(numOfSlots >= 1) {
        let trimmedStart = Moment(start).add(padding, 'milliseconds');
        for(let i=0; i<numOfSlots; i++) {
          let newStart = Moment(trimmedStart).add(i * duration, 'milliseconds').toDate();
          let newEnd = Moment(trimmedStart).add((i + 1) * duration, 'milliseconds').toDate();
          finalResult.push([newStart, newEnd]);
        }
      }
  });
  console.log(finalResult);
}

let input = {
  duration: 3600000,
  ranges: [
    {date: '2020-02-03', start:'01:00', end:'23:00'},
    {date: '2020-02-01', start:'03:00', end:'10:00'},
    {date: '2020-02-01', start:'05:00', end:'19:00'},
    {date: '2020-02-01', start:'20:00', end:'20:30'},
    {date: '2020-01-03', start:'10:00', end:'18:00'}
  ]
}

let data = input.ranges;
let duration = input.duration;

let NUSModsLinks = ['http://modsn.us/racU2', 'http://modsn.us/wzaC7'];

f(input.duration, input.ranges, NUSModsLinks);
