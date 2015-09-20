import _ from 'lodash';

export default ($scope, $state, $timi) => {
  $scope.contexts = [
    { title: 'Invites', get () { return $scope.invites; } },
    { title: 'Scheduled', get () { return $scope.scheduled; } }
  ]
  $scope.goToCreate = () => {
    $state.go('create');
  };
  $scope.goToSetting = () => {
    $state.go('settings');
  };
  $scope.goToDetails = (event) => {
    $state.go('invitation', { eventId: 2 });
  };
  $scope.slideIndex = 0;
  $scope.slideChanged = (index) => {
    $scope.slideIndex = index;
  };

  (async () => {
    try {
      let myEvents = $timi.MyEvents.query(() => {
        $scope.invites = myEvents.map((event) => {
          event.isPending = true
          return event;
        });
      });
    } catch(err) {
      console.log(err);
    }
  })()

  $scope.invites = [];
  $scope.scheduled = [];
}
