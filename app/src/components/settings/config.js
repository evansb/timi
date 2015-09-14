export default ($stateProvider) => {
  $stateProvider.state('settings',
    {
      url: '/settings',
      templateUrl: __dirname + '/view.html'
    }
  );
}
