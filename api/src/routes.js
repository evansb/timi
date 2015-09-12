import validate from './validate';
import api from './api';

module.exports = [
  {
    method: 'GET',
    path: '/api/test',
    handler: (request, reply) => {
      reply.view('test');
    }
  },

  {
    method: 'GET',
    path: '/api/me',
    config: {
      auth: 'simple'
    },
    handler: api.me
  },

  {
    method: 'GET',
    path: '/api/me/events',
    config: {
      auth: 'simple'
    },
    handler: api.myEvents
  },

  {
    method: 'GET',
    path: '/api/me/events/{eventId}',
    config: {
      auth: 'simple',
      validate: validate.myEventsAvailabilities,
      handler: api.myEventsAvailabilities
    }
  },

  {
    method: 'POST',
    path: '/api/users',
    config: {
      auth: false,
      validate: validate.newUser,
      handler: api.newUser
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      auth: 'simple',
      validate: validate.userInfo,
      handler: api.userInfo
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}/events/{eventId}',
    config: {
      auth: 'simple',
      validate: validate.userEventsAvailabilities,
      handler: api.userEventsAvailabilities
    }
  },

  {
    method: 'POST',
    path: '/api/events',
    config: {
      auth: 'simple',
      validate: validate.newEvent,
      handler: api.newEvent
    }
  },

  {
    method: 'POST',
    path: '/api/events/{eventId}',
    config: {
      auth: 'simple',
      validate: validate.newAvailabilities,
      handler: api.newAvailabilities
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots',
    config: {
      auth: 'simple',
      validate: validate.eventTimeslots,
      handler: api.eventTimeslots
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/participants',
    config: {
      auth: 'simple',
      validate: validate.eventParticipants,
      handler: api.eventParticipants
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/result',
    config: {
      auth: 'simple',
      validate: validate.eventResult,
      handler: api.eventResult
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots/{timeslotId}',
    config: {
      auth: 'simple',
      validate: validate.eventTimeslotAvailabilities,
      handler: api.eventTimeslotAvailabilities
    }
  }
];
