
const base = 'http://localhost:8000/api';

var activeUser = null;

export default function($resource) {
  let resource = (url, params, methods) => {
    return $resource(base + url, params, methods);
  };
  this.User = resource('/users');

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
