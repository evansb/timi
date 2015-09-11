import Basic from 'hapi-auth-basic';
import Bcrypt from 'bcrypt';
import User from './models/user';

var validate = function (request, email, password, callback) {
  User.query({where: {email: email}}).fetch().then(function(user) {
    if(!user) {
      return callback(null, false);
    }
    Bcrypt.compare(password, user.attributes.password, function (err, isValid) {
      callback(err, isValid, { id: user.id, name: user.name });
    });
  });
};

module.exports = function(server) {
  server.register(Basic, function (err) {
    server.auth.strategy('simple', 'basic', false, { validateFunc: validate });
  });


  server.route({
    method: 'POST',
    path: '/api/user/create',
    //config: {
    //  auth: 'simple'
    //},
    handler: (request, reply) => {
      reply(request.payload.email);
    }
  });
};
