import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import Boom from 'boom';
import Bcrypt from 'bcrypt';
import transactions from './transactions';
import Promise from 'bluebird';

exports.me = (request, reply) => {
  var user = request.auth.credentials['user'];
  reply(user.basic_info());
};

exports.myEvents = (request, reply) => {
  var user = request.auth.credentials['user'];
  Promise.all([user.related(['ownEvents']).fetch(), user.related(['invitedEvents']).fetch()]).then((events) => {
    reply({ownEvents: JSON.stringify(events[0]), invitedEvents: JSON.stringify(events[1])});
  })
};

exports.myEventsAvailabilities = (request, reply) => {
  var user = request.auth.credentials['user'];
  Event.where('id', request.params['eventId']).fetch().then((event) => {
    return user.availableForEvent(event).fetch();
  }).then((slots) => {
    reply(JSON.stringify(slots));
  });
};

exports.newUser = (request, reply) => {
  var user = request.payload['user'];
  if (!user) {
    reply(Boom.badRequest('Please specify the email and password'));
  } else {
    User.where('email', user.email).fetch().then((existing_user) => {
      if (existing_user) {
        reply(Boom.notAcceptable('Exists!'));
      } else {
        try {
          Promise.promisifyAll(Bcrypt);

          Bcrypt.hashAsync(user.password, 5).then((pw) => {
            new User(user, {hasTimestamps: true}).save('password', pw);
          });

          reply('Successfully created user ' + user.email);
        } catch (err) {
          throw err;
          reply(Boom.badData(err));
        }
      }
    });
  }
};

exports.userInfo = (request, reply) => {
  var user = request.auth.credentials['user'];
  if (user.get('id') === request.params['userId']) {
    reply.redirect('/me');
  } else {
    User.where('id', request.params['userId']).fetch().then((user) => {
      if (user) {
        reply(user.basic_info());
      } else {
        reply(Boom.notAcceptable('No such user!'));
      }
    });
  }
};

exports.userEventsAvailabilities = (request, reply) => {
  var user = request.auth.credentials['user'];
  var viewedUserId = parseInt(request.params['userId']);
  if (user.get('id') === viewedUserId) {
    throw 'You are looking at yourself';
  }
  Event.where('id', request.params['eventId']).fetch().then((event) => {
    return user.belongToEvent(event).then((result) => {
      if (event.get('owner_id') !== user.get('id') && !result) {
        throw 'Sorry, you do not have this permission';
      }
    }).then(() => {
      return User.where('id', viewedUserId).fetch();
    }).then((user) => {
      return user.availableForEvent(event).fetch();
    });
  }).then((slots) => {
    reply(JSON.stringify(slots));
  });
};

exports.userResetEmail = (request, reply) => {

};

exports.userResetPassword = (request, reply) => {

};

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
