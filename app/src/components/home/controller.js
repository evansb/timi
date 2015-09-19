
export default ($scope, $state, $timi) => {
  $scope.contexts = [
    {
      title: 'Invites',
      get () {
        return $scope.invites;
      }
    },
    {
      title: 'Scheduled',
      get () {
        return $scope.scheduled;
      }
    }
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

  $scope.invites = [
    {
      title: 'CS3216 Assignment 3 Meeting',
      inviter: 'Sharon',
      type: 'pending'
    },
    {
      title: 'A Date in Aircon Canteen',
      inviter: 'Sharon',
      type: 'pending'
    }
  ];

  $scope.scheduled = [
    {
      title: 'Avengers Meeting',
      date: '24 September',
      timeStart: '15:30',
      timeEnd: '16:30',
      type: 'confirmed'
    },
    {
      title: 'Plan Colin (McRae)\'s Birthday',
      date: '21 April',
      timeStart: '10:10',
      timeEnd: '11:30',
      type: 'confirmed'
    },
    {
      title: 'Nala Mass Petting Event',
      date: '8 December',
      timeStart: '00:00',
      timeEnd: '23:59',
      type: 'confirmed'
    },
    {
      title: 'Avengers Meeting',
      date: '24 September',
      timeStart: '15:30',
      timeEnd: '16:30',
      type: 'confirmed'
    },
    {
      title: 'Plan Colin (McRae)\'s Birthday',
      date: '21 April',
      timeStart: '10:10',
      timeEnd: '11:30',
      type: 'confirmed'
    },
    {
      title: 'Nala Mass Petting Event',
      date: '8 December',
      timeStart: '00:00',
      timeEnd: '23:59',
      type: 'confirmed'
    },
  ];
}
