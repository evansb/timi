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

        let createSlots = Promise.map(timeslots, (timeslot) => new Timeslot({start: timeslot[0], end: timeslot[1]}, {hasTimestamps: true}).save('event_id', eventId, {transacting: t}));
        let createParticipants = Promise.map(participants, (participant) => {
          let eventUser = {user_id: participant.id, event_id: eventId, important: participant.important};
          return User.where('id', participant.id).fetch()
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

exports.newAvailabilities = (user, event, availabilities) => {
  let eventId = event.get('id');
  let userId = user.get('id');
  return bookshelf.transaction((t) => {
    return event.availabilitiesForUser(user)
      .then((oldAvailabilities) => {
        return Promise.map(oldAvailabilities.toArray(), (oldAvailability) => {
          oldAvailability.where({user_id: userId, timeslot_id: oldAvailability.get('timeslot_id')}).destroy({transacting: t});
        });
      })
      .then(() => {
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
      })
      .then(() => availabilities.length > 0 ? user.going(eventId) : user.notGoing(eventId));
  });
};
