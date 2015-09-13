import Promise    from 'bluebird';
import Boom       from 'boom';
import Bcrypt     from 'bcrypt';
import User       from '../models/user';

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

export default class UserController {

  static getCurrent(request, reply) {
    let user = request.auth.credentials;
    reply(user);
  }

  static login(request, reply) {
    let { email, password } = request.payload;
    User.query({where: { email: email }}).fetch().then((user) => {
      if (!user) {
        reply(Boom.forbidden('Wrong username or password'));
      } else {
        Bcrypt.compare(password, user.attributes.password, (err, isValid) => {
          if (err) {
            reply(Boom.badImplementation('Internal server error'));
          } else if (isValid) {
            request.auth.session.set(user);
            reply(user);
          }
        });
      }
    });
  }

  static logout(request, reply) {
    request.auth.session.clear();
    reply({ status: 'logged_out' });
  }


  static getCurrentEvents(request, reply) {
    let user = request.auth.credentials;
    Promise
      .all([user.ownEvents(), user.invitedEvents()])
      .then((events) => reply(events[0].concat(events[1])))
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getCurrentAvailability(request, reply) {
    let user = request.auth.credentials;
    let eventId = request.params.eventId;
    _permit(user, eventId)
      .then((_user) => _user.availableForEvent(eventId))
      .then((slots) => reply(slots))
      .catch((err) => reply(Boom.badImplementation(err)));
  }

  static create(request, reply) {
    let user = request.payload.user;
    new User(user, { hasTimestamps: true }).trySave()
      .then((_user) => {
        reply(JSON.stringify(_user));
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static getUser(request, reply) {
    let userId = request.params.userId;
    User.where('id', userId).fetch()
      .then((_user) => {
        if(_user) {
          reply(_user);
        } else {
          reply(Boom.notFound('User does not exist'));
        }
      })
      .catch((err) => {
        reply(Boom.badRequest(err));
      });
  }

  static getUserAvailabilities(request, reply) {
    let user = request.auth.credentials;
    let {userId, eventId} = request.params;

    _permit(user, eventId)
      .then(() => {
        return User.where('id', userId).fetch();
      })
      .then((viewedUser) => {
        if (viewedUser) {
          return viewedUser.belongToEvent(eventId);
        } else {
          reply(Boom.notFound('User does not exist'));
        }
      })
      .then((result) => {
        if (!result) {
          reply(Boom.notFound('User not in the event'));
        } else {
          return result.availableForEvent(eventId);
        }
      })
      .then((slots) => {
        reply(slots);
      })
      .catch((err) => {
        reply(Boom.badImplementation(err));
      });
  }
}
