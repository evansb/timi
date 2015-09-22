import _ from 'lodash';

export default ($scope, $state, $timi) => {
  $scope.contexts = {
    Invites: {
      title: 'Invites',
      get() {
        return $scope.invites;
      }
    },
    Scheduled: {
      title: 'Scheduled',
      get() {
        return $scope.scheduled;
      }
    }
  };
  $scope.goToCreate = () => {
    $state.go('create');
  };
  $scope.goToSetting = () => {
    $state.go('settings');
  };
  $scope.goToDetails = (event) => {
    $state.go('event', { eventId: event.id });
  };
  $scope.slideIndex = 0;
  $scope.slideChanged = (index) => {
    $scope.slideIndex = index;
  };

  $scope.invites = [];
  $scope.scheduled = [];

  (async () => {
    try {
      let myEvents = $timi.MyEvents.query(() => {
        let me = $timi.Self.get(() => {
          $scope.invites = _.filter(myEvents, (event) =>
            _.includes(_.pluck(event.unconfirmed_participants, 'id'), me.id)
          ).map(event => _.assign(event, { isPending: true }));
          $scope.scheduled = _.filter(myEvents, (event) =>
            _.includes(_.pluck(event.confirmed_participants, 'id'), me.id)
          );
         });
      });
    } catch(err) {
      console.log(err);
    }
  })()
}
