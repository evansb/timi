
import moment from 'moment';

let serverTz = 4 * 60 * 60000;
let localTz = 8 * 60 * 60000;

export default () => {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-slot-card.html',
    controller: ($scope) => {
      $scope.month3 = (date) => moment(new Date(date - serverTz - localTz)).format('MMM');
      $scope.day2 = (date) => moment(new Date(date - serverTz - localTz)).format('DD');
      $scope.niceDay = (da) => {
        let date = moment(new Date(da - serverTz - localTz));
        return date.format('dddd').toUpperCase();
      };
      $scope.hourMinute = (date) => moment(new Date(date - serverTz - localTz)).format('hh:mm');
      $scope.getParentClass = () => {
        if (!$scope.$parent.event.isPending) {
          return 'timi-slot-disabled';
        } else {
          return 'timi-slot'
        }
      }
      $scope.getClass = () => {
        if (!$scope.$parent.event.isPending) {
          return 'dark';
        } else if ($scope.slot.isSelected) {
          return 'active';
        } else {
          return 'inactive';
        }
      }
    }
  };
}
