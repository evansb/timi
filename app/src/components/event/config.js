export default ($stateProvider) => {
  $stateProvider.state({
    name: 'event',
    url: '/event/:eventId',
    templateUrl: __dirname + '/view.html'
  });
}
