import _ from 'lodash';

export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  let routes = [];

  let basicRoute = (name, url, templateUrl) => {
    routes.push({ name, url, templateUrl});
  };

  basicRoute('home'         ,'/'               ,'views/home.html');
  basicRoute('login'        ,'/login'          ,'views/login.html');
  basicRoute('signup'       ,'/signup'         ,'views/signup.html');
  basicRoute('forgot'       ,'/forgot'         ,'views/forgot.html');
  basicRoute('invitation'   ,'/invitation'     ,'views/forgot.html');
  basicRoute('create'       ,'/create'         ,'views/create.html');

  _.forEach (routes, (route) => {
    $stateProvider.state(route.name,
      { url: route.url, templateUrl: route.templateUrl  });
  });
}
