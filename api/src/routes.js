import validate from './validate';
import Joi              from 'joi';
import UserController   from './controllers/user';
import EventController  from './controllers/event';

module.exports = [
  {
    method: 'GET',
    path: '/api/status',
    config: {
      tags: ['api'],
      description: 'Check API liveness',
      auth: false,
      handler: (request, reply) => {
        reply({ status: 'Running' });
      }
    }
  },
  {
    method: 'GET',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Get the basic information of the current user',
      auth: 'jwt',
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
    method: 'POST',
    path: '/api/auth/google',
    config: {
      tags: ['api'],
      description: 'Log in a user with Google+',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "helloworld" }',
      auth: false,
      handler: UserController.loginGoogle
    }
  },
  {
    method: 'POST',
    path: '/api/me/signup',
    config: {
      tags: ['api'],
      description: 'Sign up a new user',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "helloworld", "name": "hello"}',
      auth: false,
      validate: validate.newUser,
      handler: UserController.signUp
    }
  },
  {
    method: 'GET',
    path: '/api/me/logout',
    config: {
      tags: ['api'],
      description: 'Log out the current user',
      auth: 'jwt',
      handler: UserController.logout
    }
  },

  {
    method: 'GET',
    path: '/api/me/events',
    config: {
      tags: ['api'],
      description: 'Get relevant events of current user',
      auth: 'jwt',
      handler: UserController.getCurrentEvents
    }
  },
  {
    method: 'GET',
    path: '/api/events/{eventId}',
    config: {
      tags: ['api'],
      description: 'Get details of an event',
      auth: 'jwt',
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
          '"duration":"3600000", ' +
          '"latitude":"23.75", ' +
          '"longitude":"-45.82", ' +
          '"ranges": [{"date": "2020-02-10", "start": "18:00", "end": "22:00"}, ' +
      '               {"date": "2020-03-10", "start": "18:00", "end": "22:00"}], ' +
          '"participants": [{"id": 1, "registered": true, "important": true}, ' +
      '                     {"id": 2, "registered": true, "important": false}] ' +
        '}',
      auth: 'jwt',
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
      notes: 'Sample payload: [{"timeslot_id": 7, "weight": 10}, {"timeslot_id": 8, "weight": 1}]',
      auth: 'jwt',
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
      auth: 'jwt',
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
      auth: 'jwt',
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
      auth: 'jwt',
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
      auth: 'jwt',
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
      auth: 'jwt',
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
    path: '/api/users',
    config: {
      tags: ['api'],
      description: 'List all users',
      auth: 'jwt',
      handler: UserController.getAllUsers
    }
  },

  {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
      tags: ['api'],
      description: 'Get the basic information of the specified user',
      auth: 'jwt',
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
      auth: 'jwt',
      validate: validate.userEventsAvailabilities,
      handler: UserController.getUserAvailabilities
    }
  },
  {
    method: 'POST',
    path: '/api/me/reset',
    config: {
      tags: ['api'],
      description: 'Reset password of the current user',
      notes: 'Sample payload: "myNewPassword"',
      auth: 'jwt',
      validate: validate.resetPassword,
      handler: UserController.resetCurrentPassword
    }
  },
  {
    method: 'PUT',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Update the information of the current user',
      notes: 'Sample payload: { "email": "hello@example.com", "password": "newhelloworld", "name": "hello"}',
      auth: 'jwt',
      validate: validate.updateUser,
      handler: UserController.updateCurrent
    }
  },
  {
    method: 'DELETE',
    path: '/api/me',
    config: {
      tags: ['api'],
      description: 'Remove of the current user',
      auth: 'jwt',
      handler: UserController.delete
    }
  }
];
