
export default ($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'views/home.html'
  });

  $stateProvider.state('login', {
    url: '/login',
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

  $stateProvider.state('invitation', {
    url: '/invitation',
    templateUrl: 'views/invitation.html'
  });
}
