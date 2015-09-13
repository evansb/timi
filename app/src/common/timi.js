
export default function($resource) {
  const base = 'http://localhost:8000/api';
  let resource = (url, params, methods) => {
    return $resource(base + url, params, methods);
  };
  this.User = resource('/users');
}
