import _ from 'lodash';
import moment from 'moment';

export default ($scope, $state, $timi, $rootScope) => {
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

  $scope.invites = [];
  $scope.scheduled = [];

  $rootScope.$on('myEvents', (e, myEvents) => {
    let me = $timi.Self.get(() => {
      let myEvents2 = myEvents.map(event => {
        event.isPending = _.includes(me.id,
          _.pluck(event.pendingParticipants, 'id'));
        return event;
      });
      $scope.invites = _.filter(myEvents2, (event) =>
        moment(event.deadline).diff(moment()) > 0);
      $scope.scheduled = _.filter(myEvents2, (event) =>
        moment(event.deadline).diff(moment()) <= 0);
      $scope.owned = _.filter(myEvents2, (event) => event.owner.id == me.id);
     });
  });

  $rootScope.$on('eventCreated', (e) => {
    $timi.fetchMyEvents();
  });

  $rootScope.$on('availabilitySubmitted', (e) => {
    $timi.fetchMyEvents();
  });

  $timi.fetchMyEvents();
}
