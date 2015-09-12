import User from '../models/user';
import Event from '../models/event';
import EventUser from '../models/event_user';
import Timeslot from '../models/timeslot';
import Availability from '../models/availability';

import Promise from 'bluebird';

const SEED_NUM = 3;

var participantsId = [];
var timeslotsId = {};
var timeslots = [{start: '2020-01-01', end: '2020-01-02'},
  {start: '2020-02-01', end: '2020-02-02'},
  {start: '2020-03-01', end: '2020-03-02'}];

for (var i = 1; i <= SEED_NUM; i++) {
  let participant = {};
  participant.email = 'test p' + i + '@123.com';
  participant.name = 'test event participants ' + i;
  participant.password = 'awesome';
  new User(participant, {hasTimestamps: true}).save().then((p) => {
    console.log(p.get('name') + ' created!');
    participantsId.push(p.get('id'));
  });
}
for (var k = 1; k <= SEED_NUM; k++) {
  let owner = {};
  owner.email = 'test o' + k + '@123.com';
  owner.name = 'test event owner ' + k;
  owner.password = 'awesome';
  new User(owner, {hasTimestamps: true}).save()
    .then((o) => {
      console.log(o.get('name') + ' created!');
      for (var m = 1; m <= SEED_NUM; m++) {
        let event = {};
        event.name = 'event ' + i + ' ' + m;
        event.deadline = '2020-01-01';
        event.owner_id = o.get('id');
        var participants = participantsId;

        new Event(event, {hasTimestamps: true})
          .save()
          .then((event) => {
            var eventId = event.get('id');
            var createSlots = Promise.map(timeslots, (timeslot) => {
              timeslot['event_id'] = eventId;
              return new Timeslot(timeslot, {hasTimestamps: true}).save().then((ts) => {
                participantsId.forEach(function(pid) {
                  let a = {};
                  a['user_id'] = pid;
                  a['timeslot_id'] = ts.get('id');
                  a['weight'] = 5;
                  new Availability(a, {hasTimestamps: true}).save().then(() => {});
                });
              })
            });
            var createParticipants = Promise.map(participants, (participant) => {
              var eventUser = {user_id: participant, event_id: eventId};
              return new EventUser(eventUser, {hasTimestamps: true}).save();
            });
            return Promise.all(createSlots, createParticipants);
          }).then(() => {
          });
      }
    });
}
;
