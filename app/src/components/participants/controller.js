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
        event.participated_participants.header = 'Going';
        event.unparticipated_participants.header = 'Not Going';
        event.unconfirmed_participants.header = 'Pending';
      });
    } catch(err) {
      console.log(err);
    }
  })();
}
