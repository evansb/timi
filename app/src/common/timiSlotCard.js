
import moment from 'moment';

export default () => {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-slot-card.html',
    controller: ($scope) => {
      $scope.month3 = (date) => moment(date).format('MMM');
      $scope.day2 = (date) => moment(date).format('DD');
      $scope.niceDay = (da) => {
        let date = moment(da);
        if (date.calendar().indexOf('/') == -1) {
          return date.calendar().split(' ')[0].toUpperCase();
        } else {
          return date.format('dddd').toUpperCase();
        }
      };
      $scope.hourMinute = (date) => moment(date).format('hh:mm');
    }
  };
}
