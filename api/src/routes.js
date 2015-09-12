import validate from './validates';
import api from './api';

module.exports = [
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
      auth: 'simple'
    },
    handler: api.myEventsAvailabilities
  },

  {
    method: 'POST',
    path: '/api/users',
    handler: api.newUser
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      auth: 'simple',
      handler: api.userInfo
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}/events/{eventId}',
    config: {
      auth: 'simple'
    },
    handler: api.userEventsAvailabilities
  },

  {
    method: 'POST',
    path: '/api/events',
    config: {
      auth: 'simple',
      handler: api.newEvent
    }
  },

  {
    method: 'POST',
    path: '/api/events/{eventId}',
    config: {
      auth: 'simple',
      handler: api.newAvailabilities
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots',
    config: {
      auth: 'simple',
      handler: api.eventTimeslots
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/participants',
    config: {
      auth: 'simple',
      handler: api.eventParticipants
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/result',
    config: {
      auth: 'simple',
      handler: api.eventResult
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots/{timeslotId}',
    config: {
      auth: 'simple',
      handler: api.eventTimeslotAvailabilities
    }
  }
];
