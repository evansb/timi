import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import Boom from 'boom';
import Bcrypt from 'bcrypt';
import transactions from './transactions';
import Promise from 'bluebird';

exports.newEvent = (request, reply) => {
  var user = request.auth.credentials['user'];
  var event = request.payload['event'];
  try {
    transactions.newEvent(user, event);
    reply('Successfully created event ' + event.name);
  } catch (err) {
    throw err;
    reply(Boom.badData(err));
  }
};

exports.eventTimeslots = (request, reply) => {
  var user = request.auth.credentials['user'];
  var eventId = parseInt(request.params['eventId']);
  Event.where('id', request.params['eventId']).fetch().then((event) => {
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
  var user = request.auth.credentials['user'];
  var eventId = parseInt(request.params['eventId']);
  var availabilities = request.payload['availabilities'];
  if (!user || !availabilities) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      transactions.newAvailabilities(user, availabilities);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
};

exports.eventResult = (request, reply) => {
  var user = request.auth.credentials['user'];
  var eventId = parseInt(request.params['eventId']);
  Event.where('id', request.params['eventId']).fetch().then((event) => {
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
  var user = request.auth.credentials['user'];
  var eventId = parseInt(request.params['eventId']);
  Event.where('id', request.params['eventId']).fetch().
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
  var user = request.auth.credentials['user'];
  var eventId = parseInt(request.params['eventId']);
  var timeslotId = parseInt(request.params['timeslotId']);
  Event.where('id', request.params['eventId']).fetch().then((event) => {
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

exports.updateAvailabilities = (request, reply) => {

};

exports.newConfirmations = (request, reply) => {
  var user = request.auth.credentials['user'];
  var confirmations = request.payload['confirmations'];
  if (!user || !confirmations) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.userId(user);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
};
