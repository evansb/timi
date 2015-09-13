import auth       from './auth';
import Hapi       from 'hapi';
import NUSMods    from './vendor/nusmods';
import routes     from './routes';
import schema     from './schema';

var server = new Hapi.Server();

if (process.env.NODE_ENV === 'development') {
  schema();
}

server.connection({
  host: process.env.API_HOST,
  port: process.env.API_PORT
});

auth(server);

for (var route in routes) {
  server.route(routes[route]);
}

server.start(() => {
  let nusmods = new NUSMods('http://modsn.us/racU2');
  nusmods.scrap();
  console.log('Server running at ', server.info.uri);
});
