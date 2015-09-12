import Hapi from "hapi";
import NUSMods from './vendor/nusmods';
import auth from './auth';
import api from './api';

var server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 8000
});

auth(server);

server.route({
  method: 'GET',
  path: '/api/me',
  config: {
    auth: 'simple'
  },
  handler: api.me
});

server.route({
  method: 'GET',
  path: '/api/me/events',
  config: {
    auth: 'simple'
  },
  handler: api.myEvents
});

server.route({
  method: 'GET',
  path: '/api/me/events/{eventId}',
  config: {
    auth: 'simple'
  },
  handler: api.myEventsAvailabilities
});

server.route({
  method: 'POST',
  path: '/api/users',
  handler: api.newUser
});

server.route({
  method: 'GET',
  path: '/api/users/{userId}',
  config: {
    auth: 'simple',
    handler: api.userInfo
  }
});

server.route({
  method: 'GET',
  path: '/api/users/{userId}/events/{eventId}',
  config: {
    auth: 'simple'
  },
  handler: api.userEventsAvailabilities
});

server.route({
  method: 'POST',
  path: '/api/events',
  config: {
    auth: 'simple',
    handler: api.newEvent
  }
});

server.route({
  method: 'POST',
  path: '/api/events/{eventId}',
  config: {
    auth: 'simple',
    handler: api.newAvailabilities
  }
});

server.route({
  method: 'GET',
  path: '/api/events/{eventId}/timeslots',
  config: {
    auth: 'simple',
    handler: api.eventTimeslots
  }
});

server.route({
  method: 'GET',
  path: '/api/events/{eventId}/participants',
  config: {
    auth: 'simple',
    handler: api.eventParticipants
  }
});

server.route({
  method: 'GET',
  path: '/api/events/{eventId}/result',
  config: {
    auth: 'simple',
    handler: api.eventResult
  }
});

server.route({
  method: 'GET',
  path: '/api/events/{eventId}/timeslots/{timeslotId}',
  config: {
    auth: 'simple',
    handler: api.eventTimeslotAvailabilities
  }
});

server.start(() => {
  let nusmods = new NUSMods('http://modsn.us/racU2');
  nusmods.scrap();
  console.log('Server running at ', server.info.uri)
});
