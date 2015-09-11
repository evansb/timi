import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import Boom from 'boom';
import Bcrypt from 'bcrypt';
import validates from './validates';
import transactions from './transactions';
import Promise from 'bluebird';

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
  var user = request.auth.credentials['user'];
  var event = request.payload['event'];
  if (!event) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.newEvent(event);
      transactions.newEvent(user, event);
      reply('Successfully created event ' + event.name);
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
};

exports.newAvailabilities = (request, reply) => {
  var user = request.auth.credentials['user'];
  var availabilities = request.payload['availabilities'];
  if (!user || !availabilities) {
    reply(Boom.badRequest('Please specify the put in details'));
  } else {
    try {
      validates.availabilities(availabilities);
      transactions.newAvailabilities(user, availabilities);
      reply('Successfully submitted availabilities!');
    } catch (err) {
      throw err;
      reply(Boom.badData(err));
    }
  }
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
