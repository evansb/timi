import validate from './validate';
import Joi              from 'joi';
import UserController   from './controllers/user';
import EventController  from './controllers/event';

module.exports = [
  {
    method: 'GET',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Get the basic information of the current user',
      auth: 'session',
      handler: UserController.getCurrent
    }
  },
  {
    method: 'POST',
    path: '/api/me/login',
    config: {
      tags: ['api'],
      description: 'Log in a user with email and password',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "helloworld" }',
      auth: false,
      validate: validate.userLogin,
      handler: UserController.login
    }
  },
  {
    method: 'GET',
    path: '/api/me/logout',
    config: {
      tags: ['api'],
      description: 'Log out the current user',
      auth: 'session',
      handler: UserController.logout
    }
  },

  {
    method: 'GET',
    path: '/api/me/events',
    config: {
      tags: ['api'],
      description: 'Get relevant events of current user',
      auth: 'session',
      handler: UserController.getCurrentEvents
    }
  },
  {
    method: 'GET',
    path: '/api/events/{eventId}',
    config: {
      tags: ['api'],
      description: 'Get details of an event',
      auth: 'session',
      validate: {
        params: {
          eventId: Joi.number()
            .description('The event ID')
        }
      },
      handler: EventController.getEvent
    }
  },
  {
    method: 'POST',
    path: '/api/events',
    config: {
      tags: ['api'],
      description: 'Create a new event',
      notes:
      'Sample payload: ' +
        '{' +
          '"name":"Date with Sharon", ' +
          '"deadline": "2020-02-10", ' +
          '"timeslots": [{"start": "2020-02-10", "end": "2020-02-11"}, {"start": "2020-03-10", "end": "2020-03-11"}], ' +
          '"participants": [1]' +
        '}',
      auth: 'session',
      validate: validate.newEvent,
      handler: EventController.create
    }
  },

  {
    method: 'POST',
    path: '/api/events/{eventId}/availabilities',
    config: {
      tags: ['api'],
      description: 'Indicate availabilities for specified event',
      notes: 'Sample payload: {"availabilities": [{"timeslot_id": 7, "weight": 10}, {"timeslot_id": 8, "weight": 1}]}',
      auth: 'session',
      validate: validate.newAvailabilities,
      handler: EventController.createAvailabilities
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots',
    config: {
      tags: ['api'],
      description: 'Get all the timeslots for specified event',
      auth: 'session',
      validate: validate.eventTimeslots,
      handler: EventController.getTimeslots
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/participants',
    config: {
      tags: ['api'],
      description: 'Get all the participants for specified event',
      auth: 'session',
      validate: validate.eventParticipants,
      handler: EventController.getParticipants
    }
  },

  {
    method: 'GET',
    path: '/api/events/{eventId}/result',
    config: {
      tags: ['api'],
      description: 'Get the timeslots for specified event, and the number of people available for each timeslot',
      auth: 'session',
      validate: validate.eventResult,
      handler: EventController.getResult
    }
  },
  {
    method: 'GET',
    path: '/api/events/{eventId}/timeslots/{timeslotId}',
    config: {
      tags: ['api'],
      description: 'Get the user who are available for specified timeslots',
      auth: 'session',
      validate: validate.eventTimeslotAvailabilities,
      handler: EventController.getTimeslotAvailabilities
    }
  },
  {
    method: 'GET',
    path: '/api/me/events/{eventId}/availabilities',
    config: {
      tags: ['api'],
      description: 'Get the availabilities of current user for the specified events',
      auth: 'session',
      validate: validate.myEventsAvailabilities,
      handler: UserController.getCurrentAvailability
    }
  },

  {
    method: 'POST',
    path: '/api/users',
    config: {
      tags: ['api'],
      description: 'Sign up a new user',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "helloworld", "name": "hello"}',
      auth: false,
      validate: validate.newUser,
      handler: UserController.create
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      tags: ['api'],
      description: 'Get the basic information of the specified user',
      auth: 'session',
      validate: validate.userInfo,
      handler: UserController.getUser
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}/events/{eventId}/availabilities',
    config: {
      tags: ['api'],
      description: 'Get the availabilities of specified user for the specified events',
      auth: 'session',
      validate: validate.userEventsAvailabilities,
      handler: UserController.getUserAvailabilities
    }
  },
  {
    method: 'PUT',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Update the information of the current user',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "newhelloworld", "name": "hello"}',
      auth: 'session',
      validate: validate.newUser,
      handler: UserController.updateCurrent
    }
  },
  {
    method: 'DELETE',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Remove of the current user',
      auth: 'session',
      handler: UserController.delete
    }
  },


  // TODO
  {
    method: 'POST',
    path: '/api/events/{eventId}/confirmations',
    config: {
      tags: ['api'],
      description: 'Indicate confirmation for specified event result',
      notes: 'Sample payload: {"confirmations": [5, 6, 7]}',
      auth: 'session',
      validate: validate.newConfirmations,
      handler: EventController.createConfirmations
    }
  }
];
