
const base = (window.location.hostname == 'localhost')?
  'http://localhost:8000/api': 'http://timiapp.me/api';

var activeUser = null;

export default function($resource, $rootScope) {

  let resource = (url, params, methods) => {
    return $resource(base + url, params, methods);
  };

  this.MyEvents = resource('/me/events/:eventId', {
    eventId: '@id'
  });

  this.fetchMyEvents = function() {
    this.MyEvents.query((events) => $rootScope.$broadcast('myEvents', events));
  };

  this.getEvent = function(eventId) {
    try {
      this.Event.get({ eventId }, (event) => {
        $rootScope.$broadcast('eventFetched', event);
      });
    } catch(err) {
      $rootScope.$broadcast('eventFetchedErr', err);
    }
  };

  this.Event = resource('/events/:eventId', { eventId: '@id' }, {
    create: { method: 'POST' }
  });

  this.createEvent = function(options) {
    this.Event.create(options, (event) => {
      $rootScope.$broadcast('eventCreated', event);
    });
  };

  this.User = resource('/users', {}, {
    signup: {
      method: 'POST',
      withCredentials: false
    }
  });

  this.Self = resource('/me/:verb', { verb: '' }, {
    login: {
      method: 'POST',
      params: {
        verb: 'login'
      }
    },
    logout: {
      method: 'POST',
      params: {
        verb: 'logout'
      }
    }
  });

  this.getActiveUser = () => {
    try {
      this.Self.get(null, (user) => {
        $rootScope.$broadcast('meFetched', user);
      });
    } catch(err) {
      $rootScope.$broadcast('meFetchedErr', err);
    }
  }

}
