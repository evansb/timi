
import moment from 'moment';

export default () => {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-slot-card.html',
    controller: ($scope) => {
      $scope.month2 = (date) => moment(date).format('MM');
      $scope.day2 = (date) => moment(date).format('DD');
      $scope.dayLong = (date) => moment(date).format('dddd');
    }
  };
}
