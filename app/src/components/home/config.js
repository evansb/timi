export default ($stateProvider) => {
  $stateProvider.state('home',
    {
      url: '/home',
      templateUrl: __dirname + '/view.html'
    }
  );
}
