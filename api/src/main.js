import auth       from './auth';
import Hapi       from 'hapi';
import NUSMods    from './vendor/nusmods';
import routes     from './routes';
import schema     from './schema';

if (process.env.NODE_ENV === 'development') {
  schema();
}

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: true
    }
  }
});

server.connection({
  host: process.env.API_HOST,
  port: process.env.API_PORT
});

let options = {
  opsInterval: 1000,
  responsePayload: true,
  requestPayload: true,
  reporters: [
    {
      reporter: require('good-console'),
      events: { log: '*', response: '*', 'request': '*' }
    },
    {
      reporter: require('good-http'),
      events: { error: '*', response: '*', request: '*' },
      config: {
        endpoint: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT
      }
    }
  ]
};

auth(server);

for (var route in routes) {
  server.route(routes[route]);
}

server.register({
  register: require('good'),
  options: options
}, (err) => {
  if (err) {
    throw err;
  } else {
    server.start(() => {
      let nusmods = new NUSMods('http://modsn.us/racU2');
      nusmods.scrap();
      console.log('Server running at ', server.info.uri);
    });
  }
});
