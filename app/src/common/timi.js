
const base = 'http://localhost:8000/api';

let activeUser = null;

export default function($resource) {
  let resource = (url, params, methods) => {
    return $resource(base + url, params, methods);
  };
  this.User = resource('/users');
  this.setActiveUser = function(user) {
    activeUser = user;
  }
  this.getActiveUser = function() {
    return activeUser;
  }
}
