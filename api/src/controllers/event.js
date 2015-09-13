import Boom       from 'boom';
import transactions from './transactions';

export default class EventController {

  static create(request, reply) {
    let user = request.auth.credentials;
    let event = request.payload.event;
    try {
      transactions.newEvent(user, event);
      reply('OK');
    } catch (err) {
      reply(Boom.badData(err));
    }
  }

  static createAvailabilities(request, reply) {
    let user = request.auth.credentials;
    let availabilities = request.payload.availabilities;
    try {
      transactions.newAvailabilities(user, availabilities);
      reply('OK');
    } catch (err) {
      reply(Boom.badData(err));
    }
  }

  static getTimeslots(request, reply) {
    let user = request.auth.credentials;
    let eventId = parseInt(request.params.eventId);
    Event.where('id', eventId).fetch().then((event) => {
      user.belongToEvent(event).then((result) => {
        if (!result) {
          reply(Boom.forbidden('User does not belong to event'));
        } else {
          event.timeslots().fetch().then((slots) => reply(slots));
        }
      });
    });
  }

  static getResult(request, reply) {
    var user = request.auth.credentials;
    var eventId = parseInt(request.params.eventId);
    Event.where('id', eventId).fetch().then((event) => {
      user.belongToEvent(event).then((result) => {
        if (event.get('owner_id') !== user.get('id') && !result) {
          reply(Boom.forbidden('User does not belong to event'));
        } else {
          event.result().fetch().then(reply);
        }
      });
    });
  }

  static getParticipants(request, reply) {
    let user = request.auth.credentials;
    let eventId = parseInt(request.params.eventId);
    Event.where('id', eventId).fetch().then((event) => {
      user.belongToEvent(event).then((result) => {
        if (event.get('owner_id') !== user.get('id') && !result) {
          reply(Boom.forbidden('User does not belong to event'));
        } else {
          event.participants().fetch().then(reply);
        }
      });
    });
  }

  static getTimeslotAvailabilities(request, reply) {
    let user = request.auth.credentials;
    let {eventId, timeslotId} = request.params;
    Event.where('id', eventId).fetch().then((event) => {
      user.belongToEvent(event).then((result) => {
        if (event.get('owner_id') !== user.get('id') && !result) {
          reply(Boom.forbidden('User does not belong to event'));
        }
      }).then(() => {
        event.timeslots().query({where: {id: timeslotId}}).fetch()
          .then((slots) => {
            slots.first().availabilities().fetch().then(reply);
          });
      });
    });
  }
}
