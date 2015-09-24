export default ($scope, $stateParams, $state, $timi) => {
  $scope.back = () => {
    $state.go($stateParams.previous, { eventId: $stateParams.eventId });
  };
  $scope.event = null;
  (async () => {
    try {
      $timi.Event.get({
        eventId: $stateParams.eventId
      }, (event) => {
        $scope.event = event;
        event.goingParticipants.header = 'Going';
        event.notGoingParticipants.header = 'Not Going';
        event.pendingParticipants.header = 'Pending';
      });
    } catch(err) {
      console.log(err);
    }
  })();
}
