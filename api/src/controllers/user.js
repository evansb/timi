import Promise    from 'bluebird';
import Boom       from 'boom';
import Bcrypt     from 'bcrypt';
import User       from '../models/user';

let _getUserById = (userId) => {
  return User.where('id', userId).fetch();
}

let _permit = (user, eventId) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        return Promise.reject(Boom.forbidden('You are not in this event'));
      } else {
        return user;
      }
    })
};

export default class {

  static getCurrent(request, reply) {
    let user = request.auth.credentials;
    reply(user);
  }

  static login(request, reply) {
    let { email, password } = request.payload;
    User.where('email', email).fetch()
      .then((user) => {
        if (!user) {
          return Promise.reject(Boom.notFound('This user does not exist'));
        } else {
          return (Promise.promisify(Bcrypt.compare))(password, user.get('password'))
            .then((isValid) => {
              if (!isValid) {
                return Promise.reject(Boom.forbidden('Wrong username or password'));
              } else {
                request.auth.session.set(user);
                reply(user);
              }
            });
        }
      })
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static logout(request, reply) {
    request.auth.session.clear();
    reply('OK');
  }

  static getCurrentEvents(request, reply) {
    _getUserById(request.auth.credentials.id)
      .then((_user) => Promise.all([_user.ownEvents(), _user.invitedEvents()]))
      .then((events) => reply(events[0].toArray().concat(events[1].toArray())))
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getCurrentAvailability(request, reply) {
    let eventId = request.params.eventId;
    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId))
      .then((_user) => _user.availableForEvent(eventId))
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static create(request, reply) {
    let user = request.payload;
    let newUser = new User(user, { hasTimestamps: true });
    newUser.trySave()
      .then((_user) => {
        if(!_user) {
          return Promise.reject(Boom.badRequest('User with this email exists'));
        } else {
          reply(_user);
        }
      })
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getUser(request, reply) {
    let userId = request.params.userId;
    _getUserById(userId)
      .then((_user) => {
        if(!_user) {
          return Promise.reject(Boom.notFound('User does not exist'));
        } else {
          reply(_user);
        }
      })
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static getUserAvailabilities(request, reply) {
    let {userId, eventId} = request.params;

    _getUserById(request.auth.credentials.id)
      .then((_user) => _permit(_user, eventId))
      .then((_user) => _getUserById(userId))
      .then((viewedUser) => {
        if (!viewedUser) {
          return Promise.reject(Boom.notFound('User does not exist'));
        } else {
          return viewedUser.belongToEvent(eventId);
        }
      })
      .then((result) => {
        if (!result) {
          return Promise.reject(Boom.notFound('User not in the event'));
        } else {
          return result.availableForEvent(eventId);
        }
      })
      .then(reply)
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static updateCurrent(request, reply) {
    let payload = request.payload;

    _getUserById(request.auth.credentials.id)
      .then((_user) => _user.update(payload))
      .then((_user) => {
        request.auth.session.set(_user);
        reply(_user);
      })
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }

  static delete(request, reply) {
    _getUserById(request.auth.credentials.id)
      .then((_user) => _user.destroy())
      .then(() => {
        request.auth.session.clear();
        reply('OK');
      })
      .catch((err) => reply(err.isBoom ? err : Boom.badImplementation(err)));
  }
}
