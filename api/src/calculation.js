import Moment from 'moment';
import mergeIntervals from './lib/mergeIntervals';

let data = [
  {date: '2020-02-01', start:'20:00', end:'21:00'},
  {date: '2020-02-01', start:'15:00', end:'20:00'},
  {date: '2020-02-01', start:'17:00', end:'19:00'},
  {date: '2020-02-01', start:'18:00', end:'20:30'},
  {date: '2020-01-03', start:'10:00', end:'18:00'}
];

// pre-process the input data

let organizedData = {};

let generateRange = (r) => {
  let start = r.date.concat(' ').concat(r.start);
  let end = r.date.concat(' ').concat(r.end);
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

console.log(organizedData);
