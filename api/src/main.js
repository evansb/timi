import auth       from './auth';
import Hapi       from 'hapi';
import NUSMods    from './vendor/nusmods';
import routes     from './routes';

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000
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
