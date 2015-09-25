import Promise    from 'bluebird';
import Boom       from 'boom';
import Bcrypt     from 'bcrypt';
import JWT        from 'jsonwebtoken';
import _request    from 'request';
import qs         from 'querystring';
import User       from '../models/user';
import Buffer     from 'buffer';

let compare = Promise.promisify(Bcrypt.compare);
let post = Promise.promisify(_request.post);
let get = Promise.promisify(_request.get);

let third = (p) => p.spread((foo, bar) => Promise.resolve(bar));

let _getUserById = (userId) => {
  return User.where('id', userId).fetch();
};

let _getUserWithEvents = (userId) => {
  return User.where('id', userId).fetch({
    withRelated: [
      'involvedEvents',
      'ownEvents',
      'goingEvents',
      'notGoingEvents',
      'pendingEvents',
    ]
  });
};

let _permit = async (user, eventId) => {
  let result = await user.belongToEvent(eventId);
  if(!result) {
    throw Boom.forbidden('You are not in this event');
  } else {
    return user;
  }
};

let getUserId = (request) => {
  let decoded = JWT.decode(
    request.headers.authorization.split(' ')[1], { complete:true });
    return decoded.payload.id;
  }

export default class {
  static async getCurrent(request, reply) {
    try {
      let user = await _getUserWithEvents(getUserId(request));
      reply(user.toJSON());
    } catch (err) {
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
          reply(Boom.forbidden('Wrong username or password'));
        } else {
          let token = JWT.sign(user, process.env.PRIVATE_KEY);
          reply({token}).header('Authorization', token);
        }
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static logout(request, reply) {
    request.auth.session.clear();
    reply('OK');
  }

  static async getCurrentEvents(request, reply) {
    try {
      let userId = getUserId(request);
      let user = await User.where('id', userId).fetch({
        withRelated: [
          'involvedEvents.owner',
          'involvedEvents.timeslots',
          'involvedEvents.important_participants',
          'involvedEvents.normal_participants',
          'involvedEvents.goingParticipants',
          'involvedEvents.notGoingParticipants',
          'involvedEvents.pendingParticipants',
        ]
      });
      reply(user.related('involvedEvents').toJSON());
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getCurrentAvailability(request, reply) {
    try {
      let eventId = request.params.eventId;
      let user = await _getUserById(getUserId(request));
      let permitted = await _permit(user, eventId);
      let availability = await permitted.availableForEvent(eventId);
      reply(availability);
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async loginGoogle(req, reply) {
    let accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    let peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    let params = {
      code: req.payload.code,
      client_id: req.payload.clientId,
      client_secret: '0fO-iGZVcKh6iIs_Wl_pfD2m',
      redirect_uri: req.payload.redirectUri,
      grant_type: 'authorization_code'
    };
    try {
      let token = await third(post(accessTokenUrl, {json: true, form: params}));
      let accessToken = token.access_token;
      let headers = {Authorization: 'Bearer ' + accessToken};
      let profile = await third(get({url: peopleApiUrl, headers: headers, json: true}));
      let user = await User.where('google_id', profile.sub).fetch();
      if (!user) {
        let nu = {
          name: profile.name,
          email: profile.email,
          password: profile.sub,
          google_id: profile.sub
        };
        let newUser = new User(nu, {hasTimestamps: true});
        let user = await newUser.trySave();
        if (!user) {
          reply(Boom.badRequest('User with this email exists'));
        } else {
          let token = JWT.sign(user, process.env.PRIVATE_KEY);
          reply({token}).header('Authorization', token).code(201);
        }
      } else {
        let token = JWT.sign(user, process.env.PRIVATE_KEY);
        reply({token}).header('Authorization', token);
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async signUp(request, reply) {
    try {
      let newUser = new User(request.payload, {hasTimestamps: true});
      let user = await newUser.trySave();
      if (!user) {
        throw Boom.badRequest('User with this email exists');
      } else {
        let token = JWT.sign(user, process.env.PRIVATE_KEY);
        reply({token}).redirect('login').header('Authorization', token).code(201);
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async create(request, reply) {
    reply('sfddfs').redirect('/api/me/signup').rewritable(false);
  }

  static async getUser(request, reply) {
    try {
      let user = await _getUserById(request.params.userId);
      if (!user) {
        throw Boom.notFound('User does not exist');
      } else {
        reply(user);
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getAllUsers(request, reply) {
    try {
      let users = await User.fetchAll();
      if (!users) {
        throw Boom.notFound('User does not exist');
      } else {
        reply(users);
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async getUserAvailabilities(request, reply) {
    let {userId, eventId} = request.params;
    try {
      let user = await _getUserById(getUserId(request));
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
          reply(availability);
        }
      }
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async updateCurrent(request, reply) {
    let payload = request.payload;
    try {
      let user = await _getUserById(getUserId(request));
      let updated = await user.update(payload);
      reply(updated);
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }

  static async resetCurrentPassword(request, reply) {
    let password = request.payload;
    try {
      let user = await _getUserById(getUserId(request));
      let updated = await user.updatePassword(password);
      let token = JWT.sign(updated, process.env.PRIVATE_KEY);
      reply({token}).header('Authorization', token);
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }


  static async delete(request, reply) {
    try {
      let user = await _getUserById(getUserId(request));
      await user.destroy();
      reply('OK');
    } catch (err) {
      reply(err.isBoom ? err : Boom.badImplementation(err));
    }
  }
}
