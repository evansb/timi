import validate from './validate';
import api from './api';
import UsersController from './controllers/users_controller';
import EventsController from './controllers/events_controller';


module.exports = [
  {
    method: 'GET',
    path: '/api/test',
    config: {
      auth: false,
      handler: (request, reply) => {
        reply.view('test');
      }
    }
  },

  {
    method: 'GET',
    path: '/api/me',
    config: {
      auth: 'simple',
      handler: UsersController.me
    },
  },

  {
    method: 'GET',
    path: '/api/me/events',
    config: {
      auth: 'simple'
    },
    handler: UsersController.myEvents
  },

  {
    method: 'GET',
    path: '/api/me/events/{eventId}',
    config: {
      auth: 'simple',
      validate: validate.myEventsAvailabilities,
      handler: UsersController.myEventsAvailabilities
    }
  },

  {
    method: 'POST',
    path: '/api/users',
    config: {
      auth: false,
      validate: validate.newUser,
      handler: UsersController.newUser
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      auth: 'simple',
      validate: validate.userInfo,
      handler: UsersController.userInfo
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}/events/{eventId}',
    config: {
      auth: 'simple',
      validate: validate.userEventsAvailabilities,
      handler: UsersController.userEventsAvailabilities
    }
  },

  {
    method: 'POST',
    path: '/api/events',
    config: {
      auth: 'simple',
      validate: validate.newEvent,
      handler: EventsController.newEvent
    }
  },

  {
    method: 'POST',
    path: '/api/events/{eventId}/availabilities',
    config: {
      auth: 'simple',
      validate: validate.newAvailabilities,
      handler: EventsController.newAvailabilities
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots',
    config: {
      auth: 'simple',
      validate: validate.eventTimeslots,
      handler: EventsController.eventTimeslots
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/participants',
    config: {
      auth: 'simple',
      validate: validate.eventParticipants,
      handler: EventsController.eventParticipants
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/result',
    config: {
      auth: 'simple',
      validate: validate.eventResult,
      handler: EventsController.eventResult
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots/{timeslotId}',
    config: {
      auth: 'simple',
      validate: validate.eventTimeslotAvailabilities,
      handler: EventsController.eventTimeslotAvailabilities
    }
  }
];
