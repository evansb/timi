import validate from './validate';
import UserController   from './controllers/user';
import EventController  from './controllers/event';

module.exports = [
  {
    method: 'GET',
    path: '/api/me',
    config: {
      auth: 'session'
    },
    handler: UserController.getCurrent
  },
  {
    method: 'POST',
    path: '/api/me/login',
    handler: UserController.login
  },
  {
    method: 'POST',
    path: '/api/me/logout',
    config: {
      auth: 'session'
    },
    handler: UserController.logout
  },
  {
    method: 'GET',
    path: '/api/me/events',
    config: {
      auth: 'session'
    },
    handler: UserController.getCurrentEvents
  },

  {
    method: 'GET',
    path: '/api/me/events/{eventId}/availabilities',
    config: {
      auth: 'session',
      validate: validate.myEventsAvailabilities,
      handler: UserController.getCurrentAvailability
    }
  },

  {
    method: 'POST',
    path: '/api/users',
    config: {
      auth: false,
      validate: validate.newUser,
      handler: UserController.create
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      auth: 'session',
      validate: validate.userInfo,
      handler: UserController.getUser
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}/events/{eventId}',
    config: {
      auth: 'session',
      validate: validate.userEventsAvailabilities,
      handler: UserController.getUserAvailabilities
    }
  },

  {
    method: 'POST',
    path: '/api/events',
    config: {
      auth: 'session',
      validate: validate.newEvent,
      handler: EventController.create
    }
  },

  {
    method: 'POST',
    path: '/api/events/{eventId}/availabilities',
    config: {
      auth: 'session',
      validate: validate.newAvailabilities,
      handler: EventController.createAvailabilities
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots',
    config: {
      auth: 'session',
      validate: validate.eventTimeslots,
      handler: EventController.getTimeSlots
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/participants',
    config: {
      auth: 'session',
      validate: validate.eventParticipants,
      handler: EventController.getParticipants
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/result',
    config: {
      auth: 'session',
      validate: validate.eventResult,
      handler: EventController.getResult
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots/{timeslotId}',
    config: {
      auth: 'session',
      validate: validate.eventTimeslotAvailabilities,
      handler: EventController.getTimeslotAvailabilities
    }
  }
];
