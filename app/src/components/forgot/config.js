export default ($stateProvider) => {
  $stateProvider.state('forgot',
    {
      url: '/forgot',
      templateUrl: __dirname + '/view.html'
    }
  );
}
