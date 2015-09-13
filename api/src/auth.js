import Cookie   from 'hapi-auth-cookie';
import Bcrypt   from 'bcrypt';
import User     from './models/user';

var validate = (request, email, password, callback) => {
  User.query({where: {email: email}}).fetch().then((user) => {
    if(!user) {
      return callback(null, false);
    }
    Bcrypt.compare(password, user.attributes.password, (err, isValid) => {
      callback(err, isValid, { user: user });
    });
  });
};

module.exports = (server) => {
  let oneDay = 24 * 60 * 60 * 1000;
  server.register(Cookie, (err) => {
    if (err) {
      throw err;
    }
    server.auth.strategy('session', 'cookie', {
      password: 'opensesame',
      cookie: 'session',
      isSecure: false,
      ttl: oneDay
    });
  });
};
