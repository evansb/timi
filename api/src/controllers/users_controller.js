import Promise from 'bluebird';
import Boom from 'boom';
import User from '../models/user';

// PRIVATE
let _permit = (user, eventId) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        throw new Error('You are not in this event');
      } else {
        return user;
      }
    });
};

class UserController {
  static me(request, reply) {
    let user = request.auth.credentials.user;
    reply(JSON.stringify(user));
  }

  static myEvents(request, reply) {
    let user = request.auth.credentials.user;
    Promise
      .all([user.ownEvents(), user.invitedEvents()])
      .then((events) => {
        reply({ownEvents: JSON.stringify(events[0]), invitedEvents: JSON.stringify(events[1])});
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static myEventsAvailabilities(request, reply) {
    let user = request.auth.credentials.user,
        eventId = request.params.eventId;
    _permit(user, eventId)
      .then((_user) => {
        return _user.availableForEvent(eventId);
      })
      .then((slots) => {
        reply(JSON.stringify(slots));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static newUser(request, reply) {
    let user = request.payload.user;
    new User(user, { hasTimestamps: true }).trySave()
      .then((_user) => {
        reply(JSON.stringify(_user));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  // Bad practice, will change in the future
  static userInfo(request, reply) {
    // Evan: What's this for?
    // let user = request.auth.credentials.user;
    let viewedUserId = request.params.userId;
    User.where('id', viewedUserId).fetch()
      .then((_user) => {
        if(_user) {
          reply(JSON.stringify(_user));
        } else {
          throw new Error('This user does not exist');
        }
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  // Bad practice, will change in the future
  static userEventsAvailabilities(request, reply) {
    let user = request.auth.credentials.user,
        viewedUserId = request.params.userId,
        eventId = request.params.eventId;

    _permit(user, eventId)
      .then(() => {
        return User.where('id', viewedUserId).fetch();
      })
      .then((viewedUser) => {
        if(viewedUser) {
          return viewedUser.belongToEvent(eventId);
        } else {
          throw new Error('This user does not exist');
        }
      })
      .then((result) => {
        if(!result) {
          throw new Error('This user is not in this event');
        } else {
          return result.availableForEvent(eventId);
        }
      })
      .then((slots) => {
        reply(JSON.stringify(slots));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }
/*
  static userResetEmail (request, reply) {
    //TODO
  }

  static userResetPassword (request, reply) {
    //TODO
  }
*/
}

module.exports = UserController;
