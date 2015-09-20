import bookshelf from './config/bookshelf';
import Promise from 'bluebird';
import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import EventUser from './models/event_user';
import Availability from './models/availability';
import Confirmation from './models/confirmation';
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
        return Promise.all([
          createSlots,
          createParticipants]).then(() => event);
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

exports.newConfirmations = (user, eventId, top3, timeslots) => {
  let userId = user.get('id');
  let top3Id = top3.map((timeslot) => timeslot.get('id'));
  return bookshelf.transaction((t) => {
    return Promise.map(timeslots, (timeslotId) => {
      if (top3Id.indexOf(timeslotId) < 0) {
        return Promise.reject(Boom.notFound('Timeslot does not in confirmation options'));
      } else {
        return Confirmation.where({user_id: userId, timeslot_id: timeslotId}).fetch()
          .then((ts) => {
            if (ts) {
              return Promise.reject(Boom.conflict('You have confirmed it'));
            } else {
              return new Confirmation({timeslot_id: timeslotId}, {hasTimestamps: true}).save('user_id', userId, {transacting: t});
            }
          });
      }
    })
      .then(() => user.confirm(eventId));
  });
};
