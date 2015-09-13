import Promise from 'bluebird';
import Boom from 'boom';
import Event from '../models/event';
import transactions from '../transactions';


// PRIVATE
let _permit = (user, eventId) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if (!result) {
        throw new Error('You are not in this event');
      } else {
        return user;
      }
    });
};

class EventsController {
  static newEvent(request, reply) {
    let user = request.auth.credentials['user'],
      userId = user.get('id'),
      event = request.payload,
      timeslots = event['timeslots'],
      participants = event['participants'];
    event['owner_id'] = userId;
    delete event['timeslots'];
    delete event['participants'];
    if (participants.indexOf(userId) < 0) {
      participants.push(userId);
    }

    transactions.newEvent(event, timeslots, participants)
      .then((event) => {
        reply(JSON.stringify(event));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static newAvailabilities(request, reply) {
    let user = request.auth.credentials['user'],
      eventId = request.params['eventId'],
      availabilities = request.payload['availabilities'];
    _permit(user, eventId)
      .then((user) => {
        return transactions.newAvailabilities(user.get('id'), eventId, availabilities);
      })
      .then(() => {
        reply('Submitted');
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static eventTimeslots(request, reply) {
    let user = request.auth.credentials['user'],
      eventId = request.params['eventId'];
    _permit(user, eventId)
      .then((user) => {
        return Event.where('id', eventId).fetch().then((event) => {
          return event.getTimeslots();
        });
      })
      .then((timeslots) => {
        reply(JSON.stringify(timeslots));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static eventParticipants(request, reply) {
    let user = request.auth.credentials['user'],
      eventId = request.params['eventId'];
    _permit(user, eventId)
      .then((user) => {
        return Event.where('id', eventId).fetch().then((event) => {
          return event.getParticipants();
        });
      })
      .then((participants) => {
        reply(JSON.stringify(participants));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static eventResult(request, reply) {
    let user = request.auth.credentials['user'],
      eventId = request.params['eventId'];
    _permit(user, eventId)
      .then((user) => {
        return Event.where('id', eventId).fetch().then((event) => {
          return event.result();
        });
      })
      .then((result) => {
        reply(JSON.stringify(result));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static eventTimeslotAvailabilities(request, reply) {
    let user = request.auth.credentials['user'],
      eventId = request.params['eventId'],
      timeslotId = request.params['timeslotId'];
    _permit(user, eventId)
      .then((user) => {
        return Event.where('id', eventId).fetch().then((event) => {
          return event.getTimeslot(timeslotId);
        });
      })
      .then((timeslots) => {
        let timeslot = timeslots.first();
        if(!timeslot) {
          throw new Error('This timeslot does not belong to this event');
        } else {
          return timeslot.availabilities();
        }
      })
      .then((users) => {
        reply(JSON.stringify(users));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }
}

module.exports = EventsController;
