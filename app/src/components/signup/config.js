export default ($stateProvider) => {
  $stateProvider.state('signup',
    {
      url: '/signup',
      templateUrl: __dirname + '/view.html'
    }
  );
}
