import bookshelf from './config/bookshelf';
import Promise from 'bluebird';
import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import EventUser from './models/event_user';
import Availability from './models/availability';
import Boom from 'boom';

exports.newEvent = (eventParams, timeslots, participants) => {
  return bookshelf.transaction((t) => {
    return new Event(eventParams, {hasTimestamps: true})
      .save(null, {transacting: t})
      .then((event) => {
        let eventId = event.get('id');
        let createSlots = Promise.map(timeslots, (timeslot) => {
          return new Timeslot(timeslot, {hasTimestamps: true}).save('event_id', eventId, {transacting: t});
        });
        let createParticipants = Promise.map(participants, (participant) => {
          let eventUser = {user_id: participant, event_id: eventId};
          return User.where('id', participant).fetch()
            .then((user) => {
              if(!user) {
                return Promise.reject(Boom.notFound('Participant does not exist'));
              } else {
                return new EventUser(eventUser, {hasTimestamps: true}).save(null, {transacting: t});
              }
            });
        });
        return Promise.all([createSlots, createParticipants])
          .then(() => event);
      });
  });
};

exports.newAvailabilities = (user, eventId, availabilities) => {
  let userId = user.get('id');
  return bookshelf.transaction((t) => {
    return Promise.map(availabilities, (availability) => {
      return Timeslot.where({id: availability.timeslot_id, event_id: eventId}).fetch()
        .then((timeslot) => {
          if (!timeslot) {
            return Promise.reject(Boom.notFound('Timeslot does not belong to this event'));
          } else {
            return new Availability(availability, {hasTimestamps: true}).save('user_id', userId, {transacting: t});
          }
        });
    })
      .then(() => user.participate(eventId));
  });
};
