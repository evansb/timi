
export default ($scope, $location) => {
  $scope.context = 'invitation';

  $scope.toInvitation = () => {
    $scope.context = 'invitation';
  };

  $scope.toScheduled = () => {
    $scope.context = 'scheduled';
  };

  $scope.goToCreate = () => {
    $location.path('create');
  };

  $scope.goToSetting = () => {
    $location.path('invitation');
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
  ];
}
