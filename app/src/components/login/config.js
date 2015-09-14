export default ($stateProvider) => {
  $stateProvider.state('login',
    {
      url: '/login',
      templateUrl: __dirname + '/view.html'
    }
  );
}
