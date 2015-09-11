import User from './models/user';
import Event from './models/event';
import Timeslot from './models/timeslot';
import Boom from 'boom';
import validates from './validates';

exports.newUser = (request, reply) => {
  var user = request.payload['user'];
  if (!user) {
    reply(Boom.badRequest('Please specify the email and password'));
  } else {
    User.where('email', payload.email).fetch().then((existing_user) => {
      if (existing_user) {
        reply(Boom.notAcceptable('Exists!'));
      } else {
        try {
          validates.new_user(user);
          User.forge(user).save();
          reply('Successfully created user ' + user.email);
        } catch (err) {
          reply(Boom.badData(err.details[0].message));
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
      validates.new_event(event);
      reply('Successfully created event ' + event.name);
    } catch (err) {
      reply(Boom.badData(err.details[0].message));
    }
  }
};

exports.userNewEventAvailabilities = (request, reply) => {

};

exports.userUpdateEventAvailabilities = (request, reply) => {

};

exports.userEventConfirmations = (request, reply) => {

};
