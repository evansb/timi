import Event from './models/event';
import Boom from 'boom';
import transactions from './transactions';

exports.newEvent = (request, reply) => {
  var user = request.auth.credentials.user;
  var event = request.payload.event;
  try {
    transactions.newEvent(user, event);
    reply('Successfully created event ' + event.name);
  } catch (err) {
    reply(Boom.badData(err));
  }
};

exports.eventTimeslots = (request, reply) => {
  let user = request.auth.credentials.user;
  let eventId = parseInt(request.params.eventId);
  Event.where('id', eventId).fetch().then((event) => {
    user.belongToEvent(event).then((result) => {
      if (!result) {
        throw 'Sorry, you do not have this permission';
      }
    });
    return event.timeslots().fetch();
  }).then((slots) => {
    reply(JSON.stringify(slots));
  });
};

exports.newAvailabilities = (request, reply) => {
  var user = request.auth.credentials.user;
  var availabilities = request.payload.availabilities;
  if (!user || !availabilities) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      transactions.newAvailabilities(user, availabilities);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      reply(Boom.badData(err));
    }
  }
};

exports.eventResult = (request, reply) => {
  var user = request.auth.credentials.user;
  var eventId = parseInt(request.params.eventId);
  Event.where('id', eventId).fetch().then((event) => {
    return user.belongToEvent(event).then((result) => {
      if (event.get('owner_id') !== user.get('id') && !result) {
        throw 'Sorry, you do not have this permission';
      }
    }).then(() => {
      return event.result().fetch();
    });
  }).then((slots) => {
    reply(JSON.stringify(slots));
  });
};

exports.eventParticipants = (request, reply) => {
  var user = request.auth.credentials.user;
  var eventId = parseInt(request.params.eventId);
  Event.where('id', eventId).fetch().
    then((event) => {
      return user.belongToEvent(event).
        then((result) => {
          if (event.get('owner_id') !== user.get('id') && !result) {
            throw 'Sorry, you do not have this permission';
          }
        }).then(() => {
          return event.participants().fetch();
        });
    }).then((result) => {
      reply({
        participants: JSON.stringify(result)
      });
    });
};

exports.eventTimeslotAvailabilities = (request, reply) => {
  var user = request.auth.credentials.user;
  var eventId = parseInt(request.params.eventId);
  var timeslotId = parseInt(request.params.timeslotId);
  Event.where('id', eventId).fetch().then((event) => {
    return user.belongToEvent(event).then((result) => {
      if (event.get('owner_id') !== user.get('id') && !result) {
        throw 'Sorry, you do not have this permission';
      }
    }).then(() => {
      return event.timeslots().query({where: {id: timeslotId}}).fetch();
    });
  }).then((slots) => {
    return slots.first().availabilities().fetch();
  }).then((users) => {
    reply(JSON.stringify(users));
  });
};

exports.updateAvailabilities = () => {

};

exports.newConfirmations = (request, reply) => {
  var user = request.auth.credentials.user;
  var confirmations = request.payload.confirmations;
  if (!user || !confirmations) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.userId(user);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      reply(Boom.badData(err));
    }
  }
};
