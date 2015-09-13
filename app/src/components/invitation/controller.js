import moment from 'moment';

export default ($scope, $location) => {
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

  $scope.backToHome = () => {
    $location.path('home');
  };
}
