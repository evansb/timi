
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

  this.Event = resource('/events/:eventId/:verb', { eventId: '@id', verb: '' }, {
    create: {
      method: 'POST',
      params: {
        verb: null
      }
    },
    submitAvailability: {
      method: 'POST',
      params: {
        verb: 'availabilities'
      }
    }
  });

  this.createEvent = function(options) {
    this.Event.create(options, (event) => {
      $rootScope.$broadcast('eventCreated', event);
    });
  };

  this.User = resource('/users/:id', { id: '@id' }, {
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
    },
    signup: {
      method: 'POST',
      params: {
        verb: 'signup'
      }
    },
    update: {
      method: 'PUT'
    }
  });

  this.updateUser = (user) => {
    this.Self.update(user, () => {
      this.getActiveUser();
    });
  }

  this.getActiveUser = () => {
    try {
      this.Self.get(null, (user) => {
        $rootScope.$broadcast('meFetched', user);
      });
    } catch(err) {
      $rootScope.$broadcast('meFetchedErr', err);
    }
  }

  this.submitAvailability = (eventId, availability) => {
    this.Event.submitAvailability({ eventId }, availability, e => {
      $rootScope.$broadcast('availabilitySubmitted', eventId);
    });
  }
}
