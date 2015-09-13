import Basic    from 'hapi-auth-basic';
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
  server.register(Basic, () => {
    server.auth.strategy('simple', 'basic', true, { validateFunc: validate });
  });
};
