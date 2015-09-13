import bookshelf from './config/bookshelf';
import Promise from 'bluebird';
import Event from './models/event';
import Timeslot from './models/timeslot';
import EventUser from './models/event_user';
import Availability from './models/availability';

exports.newEvent = (user, params) => {
  var {timeslots, participants} = params;
  params.owner_id = user.get('id');

  bookshelf.transaction((t) => {
    new Event(params, {hasTimestamps: true})
      .save(null, {transacting: t})
      .then((event) => {
        var eventId = event.get('id');
        participants.push(event.get('owner_id'));
        var createSlots = Promise.map(timeslots, (timeslot) => {
          timeslot.event_id = eventId;
          return new Timeslot(timeslot, {hasTimestamps: true}).save(null, {transacting: t});
        });
        var createParticipants = Promise.map(participants, (participant) => {
          var eventUser = {user_id: participant, event_id: eventId};
          return new EventUser(eventUser, {hasTimestamps: true}).save(null, {transacting: t});
        });
        return Promise.all(createSlots, createParticipants);
      }).then(() => {
        t.commit();
      }).catch((err) => {
        t.rollback(err);
        throw err;
      });
  });
};

exports.newAvailabilities = (user, params) => {
  bookshelf.transaction((t) => {
    Promise.map(params, (availability) => {
      availability.user_id = user.get('id');
      return new Availability(availability, {hasTimestamps: true}).save(null, {transacting: t});
    }).then(() => {
      t.commit();
    }).catch((err) => {
      t.rollback(err);
      throw err;
    });
  });
};
