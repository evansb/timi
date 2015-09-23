import Boom              from 'boom';
import transactions      from '../transactions';
import User              from '../models/user';
import Event             from '../models/event';
import Mailer            from '../mailer';
import JWT               from 'jsonwebtoken';
import generateTimeslots from '../calculation';
import Promise           from 'bluebird';

let _permit = async (user, eventId) => {
  let result = await user.belongToEvent(eventId);
  if(!result) {
    throw Boom.forbidden('You are not in this event');
  } else {
    return user;
  }
};

let getUserId = (request) => {
  let decoded = JWT.decode(
    request.headers.authorization.split(' ')[1], { complete:true });
  return decoded.payload.id;
}

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

let ownerInList = (ownerId, list) => {
  let result = false;
  list.forEach((participant) => {
    if(participant.id === ownerId) {
      result = true;
    }
  });
  return result;
};

let fetchCalender = async (participants) => {
  let calenders = await Promise.map(participants, (participant) => {
    return _getUserById(participant.id)
      .then((user) => {
        if(!user) {
          throw Boom.notFound('This user does not exist');
        } else {
          return [user.get('nusmods'), user.get('google_id')];
        }
      });
  });

  let NUSModsC = calenders.map((_) => _[0]).filter((c) => c !== null);
  let googleC = calenders.map((_) => _[1]).filter((c) => c !== null);
  return [NUSModsC, googleC];
};

export default class {

  static async create(request, reply) {
    let eventParams = request.payload;
    let ranges = eventParams.ranges;
    let duration = eventParams.duration;
    let participantsParams = eventParams.participants;
    delete eventParams.participants;
    delete eventParams.ranges;
    delete eventParams.duration;

    try {
      let calenders = await fetchCalender(participantsParams);
      let timeslots = await generateTimeslots(duration, ranges, calenders[0], calenders[1]);

      let user = await _getUserById(getUserId(request));
      let userId = user.get('id');
      eventParams.owner_id = userId;
      if (!ownerInList(userId, participantsParams)) {
        participantsParams.push({id: userId, registered: true, important: false});
      }
      let event = await transactions.newEvent(eventParams, timeslots, participantsParams);
      reply(event);
      let participants = await event.getParticipants();
      Mailer.sendInvitationEmail(request.server.plugins.mailer, event, user, participants);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async createAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let availabilities = request.payload;
    try {
      let user = await _getUserById(getUserId(request))
      let permitted = await _permit(user, eventId);
      let hasParticipated = await user.hasParticipated(eventId);
      if(hasParticipated) {
        reply(Boom.conflict('You have submitted your availabilities before'));
      } else {
        let event = await _getEventById(eventId);
        let result = await transactions.newAvailabilities(permitted, eventId, availabilities);
        reply(result);
        let fullyParticipated = await event.isFullyParticipated();
        if(fullyParticipated) {
          let participants = await event.getParticipants();
          Mailer.sendConfirmationEmail(request.server.plugins.mailer, event, participants);
        }
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getEvent(request, reply) {
    let eventId = request.params.eventId;
    try {
      let user = await _getUserById(getUserId(request));
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
      let user = await _getUserById(getUserId(request));
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
      let user = await _getUserById(getUserId(request));
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
      let user = await _getUserById(getUserId(request));
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
      let user = await _getUserById(getUserId(request));
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
  static async createConfirmations(request, reply) {
    let eventId = request.params.eventId;
    let confirmations = request.payload;
    try {
      let user = await _getUserById(request.auth.credentials.id)
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let fullyParticipated = await event.isFullyParticipated();
      if(!fullyParticipated) {
        reply(Boom.badRequest('This event is still in polling stage'));
      } else {
        let top3 = await event.top3();
        let result = await transactions.newConfirmations(permitted, eventId, top3, confirmations);
        reply(result);
        let fullyConfirmed = await event.isFullyConfirmed();
        if(fullyConfirmed) {
          let participants = await event.getParticipants();
          Mailer.sendScheduleEmail(request.server.plugins.mailer, event, participants);
        }
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }
}
