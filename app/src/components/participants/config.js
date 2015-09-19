export default ($stateProvider) => {
  $stateProvider.state({
    name: 'participants',
    url: 'participants/:eventId',
    templateUrl: __dirname + '/view.html',
    controller: 'ParticipantListController'
  });
}
