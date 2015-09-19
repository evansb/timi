import moment from 'moment';

export default ($scope, $location, $state) => {
  $scope.slots = [
    {
      start: moment().add(3, 'days').add(1, 'hours'),
      end: moment().add(3, 'days').add(2, 'hours')
    },
    {
      start: moment().add(5, 'days').add(1, 'hours'),
      end: moment().add(5, 'days').add(2, 'hours')
    },
    {
      start: moment().add(10, 'days').add(1, 'hours'),
      end: moment().add(10, 'days').add(3, 'hours')
    }
  ];

  $scope.viewParticipants = () => {
    $state.go('participants', { previous: 'invitation', eventId: 2 })
  };

  $scope.backToHome = () => {
    $state.go('home');
  };

  $scope.isPending = false;
}
