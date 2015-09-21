import JWT   from 'hapi-auth-jwt2';
import Boom  from 'boom';
import User  from './models/user';

async function validate(decoded, request, callback) {
  let { email, password } = request.payload;
  try {
    let user = await User.where('email', email).fetch();
    if (!user) {
      callback(null, false);
    } else {
      let isValid = await compare(password, user.get('password'));
      if (!isValid) {
        callback(null, false);
      } else {
        callback(null, true);
      }
    }
  } catch(err) {
    reply(err.isBoom ? err : Boom.badImplementation(err));
  }
}

export default (server) => {
  server.register(JWT, (err) => {
    if (err) {
      throw err;
    }
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.PRIVATE_KEY,
      validateFunc: validate,
      verifyOptions: { algorithms: [ 'HS256' ] }
    });
    server.auth.default('jwt');
  });
};
