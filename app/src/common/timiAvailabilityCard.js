import moment from 'moment';

export default () => {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-availability-card.html',
    controller ($scope) {
      $scope.month3 = (date) => moment(date).format('MMM');
      $scope.day2 = (date) => moment(date).format('DD');
      $scope.dmy = (date) => moment(date).format('DD MMM')
      $scope.showRange = () => {
        if ($scope.slot.dateStart == $scope.slot.dateEnd) {
          return $scope.dmy($scope.slot.dateStart);
        } else {
          return $scope.dmy($scope.slot.dateStart) + ' to ' +
                    $scope.dmy($scope.slot.dateEnd);
        }
      }
      $scope.niceDay = (da) => {
        let date = moment(da);
        if (date.calendar().indexOf('/') == -1) {
          return date.calendar().split(' ')[0].toUpperCase();
        } else {
          return date.format('dddd').toUpperCase();
        }
      };
      $scope.hourMinute = (date) =>
        moment().startOf('day').add(date, 'seconds').format('HH:mm');
    }
  };
}
