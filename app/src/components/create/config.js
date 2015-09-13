export default ($stateProvider) => {
  $stateProvider.state('create',
    {
      url: '/create',
      templateUrl: __dirname + '/view.html'
    }
  );
}
