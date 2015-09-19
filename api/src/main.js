import auth        from './auth';
import Hapi        from 'hapi';
import NUSMods     from './vendor/nusmods';
import routes      from './routes';
import schema      from './schema';
import Inert       from 'inert';
import Vision      from 'vision';
import HapiSwagger from 'hapi-swagger';
import Pack        from '../package';

if (process.env.NODE_ENV === 'development') {
  schema();
}

var server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        credentials: true
      }
    }
  }
});

server.connection({
  host: process.env.API_HOST,
  port: process.env.API_PORT
});

let goodOptions = {
  opsInterval: 1000,
  responsePayload: true,
  requestPayload: true,
  reporters: [
    {
      reporter: require('good-console'),
      events: {log: '*', response: '*', 'request': '*'}
    },
    {
      reporter: require('good-http'),
      events: {error: '*', response: '*', request: '*'},
      config: {
        endpoint: 'http://' + process.env.API_HOST + ':' + process.env.API_PORT
      }
    }
  ]
};

let swaggerOptions = {
  apiVersion: Pack.version
};

auth(server);

for (var route in routes) {
  server.route(routes[route]);
}

server.register([
  {
    register: require('good'),
    options: goodOptions
  },
  Inert,
  Vision,
  {
    register: HapiSwagger,
    options: swaggerOptions
  }], (err) => {
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
