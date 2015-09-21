export default ($urlRouterProvider, $stateProvider) => {
  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('home',
    {
      url: '/home',
      templateUrl: __dirname + '/view.html'
    }
  );
}
