import Boom         from 'boom';
import transactions from '../transactions';
import User         from '../models/user';
import Event        from '../models/event';

let _permit = async (user, eventId) => {
  let result = await user.belongToEvent(eventId);
  if(!result) {
    throw Boom.forbidden('You are not in this event');
  } else {
    return user;
  }
};

let _getUserById = (userId) => {
  return User.where('id', userId).fetch();
};

let _getEventById = (eventId) => {
  return Event.where('id', eventId).fetch({
    withRelated: [
      'owner',
      'timeslots',
      'important_participants',
      'normal_participants',
      'participated_participants',
      'unparticipated_participants',
      'confirmed_participants',
      'unconfirmed_participants'
    ]
  });
};

export default class {

  static async create(request, reply) {
    let event = request.payload;
    let timeslots = event.timeslots;
    let participants = event.participants;
    delete event.timeslots;
    delete event.participants;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let userId = user.get('id');
      event.owner_id = userId;
      if (participants.indexOf(userId) < 0) {
        participants.push(userId);
      }
      let result = await transactions.newEvent(event, timeslots, participants);
      reply(result);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async createAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let availabilities = request.payload.availabilities;
    try {
      let user = await _getUserById(request.auth.credentials.id)
      let permitted = await _permit(user, eventId);
      let result = await transactions.newAvailabilities(permitted, eventId,
        availabilities);
      reply(result);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getEvent(request, reply) {
    let eventId = request.params.eventId;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      reply(event.toJSON());
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getTimeslots(request, reply) {
    let eventId = request.params.eventId;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let timeslots = await event.getTimeslots();
      reply(timeslots);
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getResult(request, reply) {
    let eventId = request.params.eventId;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let result = await event.getResult();
      reply(result);
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getParticipants(request, reply) {
    let eventId = request.params.eventId;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let result = await event.getParticipants();
      reply(result);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getTimeslotAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let timeslotId = request.params.timeslotId;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let timeslots = await event.getTimeslot(timeslotId);
      if (timeslot.first()) {
        reply(Boom.notFound('Timeslot does not exist in this event'));
      } else {
        let availabilities = await timeslot.availabilities();
        reply(availabilities);
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  //TODO
  static createConfirmations(request, reply) {
    reply('OK');
  }
}
