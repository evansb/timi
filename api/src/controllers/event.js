import Boom         from 'boom';
import transactions from '../transactions';
import User         from '../models/user';
import Event        from '../models/event';

let _permit = (user, eventId) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        return Promise.reject(Boom.forbidden('You are not in this event'));
      } else {
        return user;
      }
    });
};

let _getUserById = (userId) => {
  return User.where('id', userId).fetch();
};

let _getEventById = (eventId) => {
  return Event.where('id', eventId).fetch();
}

export default class {

  static create(request, reply) {
    let event = request.payload;
    let timeslots = event.timeslots;
    let participants = event.participants;
    delete event['timeslots'];
    delete event['participants'];

    _getUserById(request.auth.credentials.id).
      then((user) => {
        let userId = user.get('id');
        event['owner_id'] = userId;
        if (participants.indexOf(userId) < 0) {
          participants.push(userId);
        }
        return transactions.newEvent(event, timeslots, participants);
      })
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static createAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let availabilities = request.payload.availabilities;

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId))
      .then((_user) => _user.hasParticipated(eventId).then((result) => result ? Promise.reject(Boom.conflict('You have submitted your availabilities before')) : _user))
      .then((_user) => transactions.newAvailabilities(_user, eventId, availabilities))
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getTimeslots(request, reply) {
    let eventId = request.params.eventId;

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => _getEventById(eventId))
      .then((event) => event.getTimeslots())
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getResult(request, reply) {
    let eventId = request.params['eventId'];

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => _getEventById(eventId))
      .then((event) => event.getResult())
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getParticipants(request, reply) {
    let eventId = parseInt(request.params.eventId);

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => _getEventById(eventId))
      .then((event) => event.getParticipants())
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getTimeslotAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let timeslotId = request.params.timeslotId;

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => _getEventById(eventId))
      .then((event) => event.getTimeslot(timeslotId))
      .then((timeslots) => {
        let timeslot = timeslots.first();
        if(!timeslot) {
          return Promise.reject(Boom.notFound('Timeslot does not exist in this event'));
        } else {
          return timeslot.availabilities();
        }
      })
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  //TODO

  static createConfirmations(request, reply) {
    reply('OK');
  }
}
