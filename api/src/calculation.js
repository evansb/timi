import Moment from 'moment';
import mergeIntervals from './lib/mergeIntervals';
import NUSMods from './vendor/nusmods';
import Promise    from 'bluebird';
import boxIntersect1D from 'box-intersect-1d';

// TODO
let inEvenWeek = (date) => {
  return true;
}

let data = [
  {date: '2020-02-01', start:'01:00', end:'02:00'},
  {date: '2020-02-01', start:'03:00', end:'04:00'},
  {date: '2020-02-01', start:'05:00', end:'19:00'},
  {date: '2020-02-01', start:'20:00', end:'20:30'},
  {date: '2020-01-03', start:'10:00', end:'18:00'}
];

let NUSModsLinks = ['http://modsn.us/racU2', 'http://modsn.us/wzaC7'];

// pre-process the input data

let organizedData = {};

let generateRange = (r) => {
  let start = r.date.concat(' ', r.start);
  let end = r.date.concat(' ', r.end);
  return [new Date(start), new Date(end)];
};

data.map((range) => {
  let date = (Moment(range.date).format('YYYY-MM-DD'));
  if(organizedData[date] === undefined) {
    organizedData[date] = [];
  }
  organizedData[date].push(generateRange(range));
});

// sort and merge
for(var date in organizedData) {
  organizedData[date] = mergeIntervals(organizedData[date]);
}


// pre-process the nus mods

let dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

let getAllClasses = async (links) => {
  let classes = await Promise.map(NUSModsLinks, (link) =>(new NUSMods(link)).scrap());
  let flattened = [].concat.apply([],classes);
  return flattened;
};

let split = (timeString) => {
  return timeString.slice(0,2).concat(':', timeString.slice(2,4));
};

let availableIntervalsInThisDay = async (dateString) => {
  let date = new Date(dateString);
  let allClasses = await getAllClasses(NUSModsLinks);
  let day = dayMap[date.getDay()];
  let intervals = [];

  allClasses.forEach((cls) => {
    if(cls['DayText'] === day) {
      let datetime = {date: dateString, start: split(cls.StartTime), end: split(cls.EndTime)};
      intervals.push(generateRange(datetime));
    }
  });

  let mergedIntervals = mergeIntervals(intervals);
  let mergedLength = mergedIntervals.length;
  let reversedIntervals = [];
  let startOfThisDay = Moment(date).startOf('day').toDate();
  let endOfThisDay = Moment(date).add(1, 'days').startOf('day').toDate();

  if(mergedLength === 0) {
    return [];
  }

  if(mergedIntervals[0][0] > startOfThisDay) {
    reversedIntervals.push([startOfThisDay, mergedIntervals[0][0]]);
  }

  for(var i=1;i < mergedLength; i++) {
    let previousEnd = mergedIntervals[i-1][1];
    let thisStart = mergedIntervals[i][0];
    reversedIntervals.push([previousEnd, thisStart]);
  }

  if(mergedIntervals[mergedLength-1][1] < endOfThisDay) {
    reversedIntervals.push([mergedIntervals[mergedLength-1][1], endOfThisDay]);
  }

  return reversedIntervals;
};

let findIntersection = (overlappingPair) => {
  let maxStart = overlappingPair[0][0] > overlappingPair[1][0] ? overlappingPair[0][0] : overlappingPair[1][0];
  let minEnd = overlappingPair[0][1] > overlappingPair[1][1] ? overlappingPair[1][1] : overlappingPair[0][1];
  return [maxStart, minEnd];
};

let finalIntervals = async (organizedData) => {
  for(var date in organizedData) {
    let input = organizedData[date];
    let available = await availableIntervalsInThisDay(date);
    let overlappingPairs = [];
    boxIntersect1D.bipartite(input, available, function(r, b) {
      overlappingPairs.push([input[r], available[b]]);
    });
    organizedData[date] = overlappingPairs.map(findIntersection);
  }
  return organizedData;
};

finalIntervals(organizedData).then(console.log);

//console.log(getAllClasses(NUSModsLinks));

//console.log(a);


//console.log(organizedData);
