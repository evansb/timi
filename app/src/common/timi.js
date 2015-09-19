
const base = 'http://localhost:8000/api';

var activeUser = null;

export default function($resource) {
  let resource = (url, params, methods) => {
    return $resource(base + url, params, methods);
  };

  this.Event = resource('/me/events', {}, {
    fetch: {
      method: 'GET',
      isArray: true
    }
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
      },
      withCredentials: false
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
