import Cookie   from 'hapi-auth-cookie';

export default (server) => {
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
