import JWT   from 'hapi-auth-jwt2';
import Boom  from 'boom';
import User  from './models/user';

async function validate(decoded, request, callback) {
  // Todo: Check decoded.id should be in database
  callback(null, true);
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
