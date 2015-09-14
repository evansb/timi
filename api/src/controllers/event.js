import Boom         from 'boom';
import transactions from '../transactions';
import User         from '../models/user';
import Event        from '../models/event';

let _permit = (user, eventId, reply) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        reply(Boom.forbidden('You are not in this event'));
      } else {
        return user;
      }
    });
};

let _getUser = (user) => {
  return User.where('id', user.id).fetch();
};

export default class EventController {

  static create(request, reply) {
    let event = request.payload;
    let timeslots = event.timeslots;
    let participants = event.participants;
    delete event['timeslots'];
    delete event['participants'];

    _getUser(request.auth.credentials).
      then((user) => {
        let userId = user.get('id');
        event['owner_id'] = userId;
        if (participants.indexOf(userId) < 0) {
          participants.push(userId);
        }
        return transactions.newEvent(event, timeslots, participants);
      })
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static createAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let availabilities = request.payload.availabilities;
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => transactions.newAvailabilities(_user.get('id'), eventId, availabilities))
      .then(() => {
        reply('Submitted');
      })
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getTimeslots(request, reply) {
    let eventId = request.params.eventId;
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => Event.where('id', eventId).fetch())
      .then((event) => event.getTimeslots())
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getResult(request, reply) {
    let eventId = request.params['eventId'];
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => Event.where('id', eventId).fetch())
      .then((event) => event.getResult())
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getParticipants(request, reply) {
    let eventId = parseInt(request.params.eventId);
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => Event.where('id', eventId).fetch())
      .then((event) => event.getParticipants())
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getTimeslotAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let timeslotId = request.params.timeslotId;
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => Event.where('id', eventId).fetch())
      .then((event) => event.getTimeslot(timeslotId))
      .then((timeslots) => {
        let timeslot = timeslots.first();
        if(!timeslot) {
          reply(Boom.notFound('Timeslot does not exist in this event'));
        } else {
          return timeslot.availabilities();
        }
      })
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
  }
}
