export default ($stateProvider) => {
  $stateProvider.state({
    name: 'invitation',
    url: '/invitation/:eventId',
    templateUrl: __dirname + '/view.html'
  });
}
