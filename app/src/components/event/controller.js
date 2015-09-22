import moment from 'moment';

export default ($scope, $location, $state, $stateParams, $timi) => {
  $scope.event = null;

  (async () => {
    try {
      $timi.Event.get({
        eventId: $stateParams.eventId
      }, (event) => {
        $scope.event = event;
        console.log($scope.event);
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

  $scope.selected = 0;

  $scope.clearSelection = () => {
    for (var i = 0; i < $scope.event.timeslots.length; i++) {
      $scope.event.timeslots[i].isSelected = false;
    }
    $scope.selected = 0;
  };

  $scope.selectTimeSlot = (id) => {
    if ($scope.event.timeslots[id].isSelected) {
      $scope.selected -= 1;
      $scope.event.timeslots[id].isSelected = false;
    } else {
      $scope.selected += 1;
      $scope.event.timeslots[id].isSelected = true;
    }
  };
}
