import Promise    from 'bluebird';
import Boom       from 'boom';
import Bcrypt     from 'bcrypt';
import User       from '../models/user';

let compare = Promise.promisify(Bcrypt.compare);

let _getUserById = (userId) => {
  return User.where('id', userId).fetch();
}

let _permit = async (user, eventId) => {
  let result = await user.belongToEvent(eventId);
  if(!result) {
    throw Boom.forbidden('You are not in this event');
  } else {
    return user;
  }
};

export default class {
  static async getCurrent(request, reply) {
    try {
      let user = await _getUserById(request.auth.credentials.id);
      reply(user);
    } catch(err) {
      reply(Boom.notFound('User not found'));
    }
  }

  static async login(request, reply) {
    let { email, password } = request.payload;
    try {
      let user = await User.where('email', email).fetch();
      if (!user) {
        reply(Boom.notFound('This user does not exist'));
      } else {
        let isValid = await compare(password, user.get('password'));
        if (!isValid) {
          return Promise.reject(Boom.forbidden('Wrong username or password'));
        } else {
          request.auth.session.set(user);
          reply(user);
        }
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static logout(request, reply) {
    request.auth.session.clear();
    reply('OK');
  }

  static async getCurrentEvents(request, reply) {
    try {
      let userId = request.auth.credentials.id;
      let user = await User.where('id', userId).fetch({
        withRelated: ['involvedEvents.owner']
      });
      reply(user.related('involvedEvents').toJSON());
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getCurrentAvailability(request, reply) {
    try {
      let eventId = request.params.eventId;
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(_user, eventId);
      let availability = await permitted.availableForEvent(eventId);
      reply(availability);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async create(request, reply) {
    try {
      let newUser = new User(request.payload, { hasTimestamps: true });
      let user = await newUser.trySave();
      if (!user) {
        throw Boom.badRequest('User with this email exists');
      } else {
        reply(_user);
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getUser(request, reply) {
    try {
      let user = await _getUserById(request.params.userId);
      if(!user) {
        throw Boom.notFound('User does not exist');
      } else {
        reply(user);
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getUserAvailabilities(request, reply) {
    let {userId, eventId} = request.params;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let permitted = await _permit(user, eventId);
      let viewedUser = await _getUserById(userId);
      if (!viewedUser) {
        throw Boom.notFound('User does not exist');
      } else {
        let result = await viewedUser.belongToEvent(eventId);
        if (!result) {
          throw Boom.notFound('User not in the event');
        } else {
          let availability = await result.availableForEvent(eventId);
          reply(result);
        }
      }
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async updateCurrent(request, reply) {
    let payload = request.payload;
    try {
      let user = await _getUserById(request.auth.credentials.id);
      let updated = await user.update(payload);
      request.auth.session.set(updated);
      reply(updated);
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async delete(request, reply) {
    try {
      let user = await _getUserById(request.auth.credentials.id);
      await _user.destroy();
      request.auth.session.clear();
      reply('OK')
    } catch(err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }
}
