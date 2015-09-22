import _ from 'lodash';

export default ($scope, $state, $timi) => {
  $scope.contexts = [
    {
      idx: 0,
      title: 'Event Invites',
      get: () => {
        return $scope.invites;
      }
    },
    {
      idx: 1,
      title: 'Scheduled Events',
      get: () => {
        return $scope.scheduled;
      }
    },
    {
      idx: 2,
      title: 'Your Events',
      get: () => {
        return $scope.owned;
      }
    }
  ];
  $scope.form = { idx: '0' };

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
          $scope.owned = _.filter(myEvents, (event) => event.owner.id == me.id);
         });
      });
    } catch(err) {
      console.log(err);
    }
  })()
}
