
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/login.html'
  });

  $stateProvider.state('signup', {
    url: '/signup',
    templateUrl: 'views/signup.html'
  });

  $stateProvider.state('forgot', {
    url: '/forgot',
    templateUrl: 'views/forgot.html'
  });
}
