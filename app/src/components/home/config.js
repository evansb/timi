export default ($urlRouterProvider, $stateProvider) => {
  $urlRouterProvider.otherwise('/home');
  $stateProvider.state('home',
    {
      url: '/home',
      templateUrl: __dirname + '/view.html'
    }
  );
}
