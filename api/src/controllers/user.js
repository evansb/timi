import Promise    from 'bluebird';
import Boom       from 'boom';
import Bcrypt     from 'bcrypt';
import User       from '../models/user';

let _getUser = (user) => {
  return User.where('id', user.id).fetch();
}

let _permit = (user, eventId, reply) => {
  return user.belongToEvent(eventId)
    .then((result) => {
      if(!result) {
        reply(Boom.forbidden('You are not in this event'));
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
    _getUser(request.auth.credentials)
      .then((_user) => Promise.all([_user.ownEvents(), _user.invitedEvents()]))
      .then((events) => reply(events[0].toArray().concat(events[1].toArray())))
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getCurrentAvailability(request, reply) {
    let eventId = request.params.eventId;
    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => _user.availableForEvent(eventId))
      .then((slots) => reply(slots))
      .catch((err) => reply(Boom.badImplementation(err)));
  }

  static create(request, reply) {
    let user = request.payload;
    let newUser = new User(user, { hasTimestamps: true });
    newUser.trySave()
      .then(reply)
      .catch((err) => reply(Boom.badRequest(err)));
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
      .catch((err) => reply(Boom.badRequest(err)));
  }

  static getUserAvailabilities(request, reply) {
    let {userId, eventId} = request.params;

    _getUser(request.auth.credentials)
      .then((_user) => _permit(_user, eventId, reply))
      .then((_user) => User.where('id', userId).fetch())
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
      .then(reply)
      .catch((err) => reply(Boom.badImplementation(err)));
  }


  //TODO

  static update(request, reply) {
    reply('OK');
  }

  static delete(request, reply) {
    reply('OK');
  }
}
