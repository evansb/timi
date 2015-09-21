import moment from 'moment';

export default ($scope, $location, $state, $stateParams, $timi) => {
  $scope.event = null;

  (async () => {
    try {
      $timi.Event.get({
        eventId: $stateParams.eventId
      }, (event) => {
        $scope.event = event;
      });
    } catch(err) {
      console.log(err);
    }
  })();

  $scope.viewParticipants = () => {
    $state.go('participants', {
      previous: 'event',
      eventId: $scope.event.id,
      event: $scope.event
    })
  };

  $scope.backToHome = () => {
    $state.go('home');
  };
}
