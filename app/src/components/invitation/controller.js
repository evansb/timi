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
      previous: 'invitation',
      eventId: event.id
    })
  };

  $scope.backToHome = () => {
    $state.go('home');
  };
}
