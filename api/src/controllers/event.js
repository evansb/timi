import Boom              from 'boom';
import transactions      from '../transactions';
import User              from '../models/user';
import Event             from '../models/event';
import Mailer            from '../mailer';
import JWT               from 'jsonwebtoken';
import generateTimeslots from '../calculation';
import Promise           from 'bluebird';
import schedule          from 'node-schedule';

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
      'goingParticipants',
      'notGoingParticipants',
      'pendingParticipants'
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
          return [user, user.get('nusmods'), user.get('google_id'), participant.important];
        }
      });
  });

  let important = calenders.filter((_) => _[3]);
  let normal = calenders.filter((_) => !_[3]);
  return {important: important, normal: normal};
};

let mapToNUSMods = (calenders) => {
  return calenders.map((_) => _[1]).filter((c) => c !== null);
};

let mapToGoogleC = (calenders) => {
  return calenders.map((_) => _[2]).filter((c) => c !== null);
};

let calculateTimeslots = async (duration, ranges, userCalenders) => {
  // get those should not be removed: either important or no calender
  let normalNoCanlentder = userCalenders.normal.filter((_) => _[1]===null && _[2]===null);
  let must = userCalenders.important.concat(normalNoCanlentder);

  // get those can be removed
  let fulfilledOptional = userCalenders.normal.filter((_) => _[1]!==null || _[2]!==null);
  let nonFulfilledOptional = [];

  let thisRound = must.concat(fulfilledOptional);
  let minimumRequirement = Math.ceil(thisRound.length/2);
  let timeslots = await generateTimeslots(duration, ranges, mapToNUSMods(thisRound), mapToGoogleC(thisRound));

  while(fulfilledOptional.length > 0 && timeslots.length === 0 && thisRound.length > minimumRequirement) {
    nonFulfilledOptional.push(fulfilledOptional.pop());
    thisRound = must.concat(fulfilledOptional);
    timeslots = await generateTimeslots(duration, ranges, mapToNUSMods(thisRound), mapToGoogleC(thisRound));
  }
  return {timeslots: timeslots, nonFulfilled: nonFulfilledOptional};
}


export default class {

  static async create(request, reply) {
    let eventParams = request.payload;
    let ranges = eventParams.ranges;
    let duration = eventParams.duration;
    let participantsParams = eventParams.participants;
    eventParams.deadline = new Date(eventParams.deadline);
    delete eventParams.participants;
    delete eventParams.ranges;
    delete eventParams.duration;

    try {
      let user = await _getUserById(getUserId(request));
      let userId = user.get('id');
      eventParams.owner_id = userId;
      if (!ownerInList(userId, participantsParams)) {
        participantsParams.push({id: userId, registered: true, important: false});
      }

      let calenders = await fetchCalender(participantsParams);
      let calculated = await calculateTimeslots(duration, ranges, calenders);

      let timeslots = calculated.timeslots;

      if (timeslots.length <= 0) {
        reply(Boom.notFound('Sorry, there is no possible timeslots for this event'));
      } else if (timeslots.length >=100) {
        reply(Boom.methodNotAllowed('This event has too many timeslots'));
      } else {
        let event = await transactions.newEvent(eventParams, timeslots, participantsParams);
        event = await _getEventById(event.get('id'));
        let eventResp = event.toJSON();
        eventResp.nonFulfillUser = calculated.nonFulfilled;
        reply(eventResp).code(201);
        let participants = await event.getParticipants();
        Mailer.sendInvitationEmail(request.server.plugins.mailer, event, user, participants);
        schedule.scheduleJob(eventParams.deadline, function(){
          Mailer.sendScheduleEmail(request.server.plugins.mailer, event, participants);
        });
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async createAvailabilities(request, reply) {
    let eventId = request.params.eventId;
    let availabilities = request.payload;
    try {
      let user = await _getUserById(getUserId(request));
      let permitted = await _permit(user, eventId);
      let event = await _getEventById(eventId);
      let deadline = event.get('deadline');

      if(deadline !== null && deadline <= new Date()) {
        reply(Boom.methodNotAllowed('This event has been scheduled already'))
      } else {
        let result = await transactions.newAvailabilities(permitted, event, availabilities);
        reply(result);
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
      let result = await event.getResult();
      let eventResp = event.toJSON();
      let timeslots = await user.availableForEvent(eventId);
      let isFullyParticipated = await event.isFullyParticipated();
      eventResp.result = result;
      eventResp.myAvailableTimeslots = timeslots.toArray();
      eventResp.isFullyParticipated = isFullyParticipated;
      reply(eventResp);
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
}
