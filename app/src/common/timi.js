
const base = 'http://localhost:8000/api';

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

  this.createEvent = function(options) {
    this.Event.create(options, (event) => {
      $rootScope.$broadcast('eventCreated', event);
    });
  };

  this.Event = resource('/events/:eventId', { eventId: '@id' }, {
    create: { method: 'POST' }
  });

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

  this.setActiveUser = (user) => {
    activeUser = user;
  }

  this.getActiveUser = () => {
    return activeUser;
  }

  this.isLoggedIn = () => {
    return activeUser != null;
  }
}
