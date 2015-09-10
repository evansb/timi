
import Hapi from "hapi";
import NUSMods from './vendor/nusmods';

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000
});

server.route({
  method: 'GET',
  path: '/api/v1/status',
  handler: (request, reply) => {
    reply('running');
  }
});

server.start(() => {
  let nusmods = new NUSMods('http://modsn.us/racU2');
  nusmods.scrap();
  console.log('Server running at ', server.info.uri)
});
