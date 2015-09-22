import Moment from 'moment';
import Timezone from 'moment-timezone';
import mergeIntervals from './lib/mergeIntervals';
import NUSMods from './vendor/nusmods';
import Promise    from 'bluebird';
import _ from 'lodash';


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

let classesInThisDay = async (dateString) => {
  let date = new Date(dateString);
  let allClasses = await getAllClasses(NUSModsLinks);
  let day = dayMap[date.getDay()];
  let result = [];

  allClasses.forEach((cls) => {
    if(cls['DayText'] === day) {
      let datetime = {date: dateString, start: split(cls.StartTime), end: split(cls.EndTime)};
      result.push(generateRange(datetime));
    }
  });

  console.log(result);

  let mergedResult = mergeIntervals(result);
  console.log(mergedResult);
  return mergedResult;
};

classesInThisDay('2015-09-22');

//console.log(getAllClasses(NUSModsLinks));

//console.log(a);


//console.log(organizedData);
