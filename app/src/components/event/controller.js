import moment from 'moment';
import _ from 'lodash';

export default ($scope, $state, $stateParams, $timi, $rootScope, $Offline) => {
  if (!$stateParams.eventId) {
    $state.go('/home');
  }

  $scope.event = {};
  $scope.isOnline = true;

  $Offline.on('up', () => {
    $scope.isOnline = true;
    $timi.getActiveUser();
    $scope.$apply();
  });

  $Offline.on('down', () => {
    $scope.isOnline = false;
    $scope.$apply();
  });

  $rootScope.$on('meFetched', (e, me) => {
    $scope.userId = me.id;
    $timi.getEvent($stateParams.eventId);
  });

  $rootScope.$on('eventFetched', (e, event) => {
    let unconfirmed = _.pluck(event.pendingParticipants, 'id');
    $scope.event = event;
    $scope.event.isPending = _.includes(unconfirmed, $scope.userId);
  });

  $timi.getActiveUser();

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

  $scope.submitAvailability = () => {
    if ($scope.isOnline) {
      let availability =
        _($scope.event.timeslots)
          .filter(slot => slot.isSelected)
          .map(slot => { return { timeslot_id: slot.id, weight: 10 }; })
          .value();
      $timi.submitAvailability($scope.event.id, availability);
    } else {
      $Offline.showPopup();
    }
  }

  $scope.selected = 0;

  $scope.clearSelection = () => {
    _.each($scope.event.timeslots, slot => { slot.isSelected = false; });
    $scope.selected = 0;
  };

  $rootScope.$on('availabilitySubmitted', (e) => {
    $state.go('home');
  });

  $scope.selectTimeSlot = (id) => {
    if (!$scope.event.isPending) {
      return;
    }
    if ($scope.event.timeslots[id].isSelected) {
      $scope.selected -= 1;
      $scope.event.timeslots[id].isSelected = false;
    } else {
      $scope.selected += 1;
      $scope.event.timeslots[id].isSelected = true;
    }
  };
}
