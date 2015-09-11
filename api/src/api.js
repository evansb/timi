import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import Boom from 'boom';
import validates from './validates';
import transactions from './transactions';

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
          validates.newUser(user);
          new User(user, {hasTimestamps: true}).save().then(()=>{});
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
  var email = request.params['email'];
  if (!email) {
    reply(Boom.badRequest('Please specify the user email'));
  } else {
    User.where('email', email).fetch().then((user) => {
      if (user) {
        reply(user.basic_info());
      } else {
        reply(Boom.notAcceptable('No such user!'));
      }
    });
  }
};

exports.userResetEmail = (request, reply) => {

};

exports.userResetPassword = (request, reply) => {

};

exports.newEvent = (request, reply) => {
  var event = request.payload['event'];
  if (!event) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.newEvent(event);
      transactions.newEvent(event);
      reply('Successfully created event ' + event.name);
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
};

exports.userNewEventAvailabilities = (request, reply) => {
  var user = request.payload['user'];
  var availabilities = request.payload['availabilities'];
  if (!user || !availabilities) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.userId(user);
      validates.availabilities(availabilities);
      transactions.userNewEventAvailabilities(user, availabilities);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
};

exports.userUpdateEventAvailabilities = (request, reply) => {

};

exports.userEventConfirmations = (request, reply) => {

};
