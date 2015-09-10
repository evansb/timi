
import Hapi from "hapi";
import NUSMods from './vendor/nusmods';

/*
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
  console.log('Server running at ', server.info.uri)
});
*/

NUSMods.scrap('http://modsn.us/racU2');
