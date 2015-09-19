export default ($stateProvider) => {
  $stateProvider.state({
    name: 'participants',
    url: 'participants/:eventId',
    params: {
      previous: null
    },
    templateUrl: __dirname + '/view.html',
    controller: 'ParticipantListController'
  });
}
