export default ($stateProvider) => {
  $stateProvider.state('invitation',
    {
      url: '/invitation',
      templateUrl: __dirname + '/view.html'
    }
  );
}
