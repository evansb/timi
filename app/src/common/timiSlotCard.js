
import moment from 'moment';

let serverTz = 4 * 60 * 60000;
let localTz = 8 * 60 * 60000;

export default () => {
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: __dirname + '/timi-slot-card.html',
    controller: ($scope) => {
      $scope.month3 = (date) => {
        var newDate = new Date((new Date(date)).getTime() - serverTz - localTz);
        return moment(newDate).format('MMM');
      };
      $scope.day2 = (date) => {
        var newDate = new Date((new Date(date)).getTime() - serverTz - localTz);
        return moment(newDate).format('DD');
      };
      $scope.niceDay = (date) => {
        var newDate = new Date((new Date(date)).getTime() - serverTz - localTz);
        return moment(newDate).format('dddd').toUpperCase();
      };
      $scope.hourMinute = (date) => {
        var newDate = new Date((new Date(date)).getTime() - serverTz - localTz);
        return moment(newDate).format('HH:mm');
      };
      $scope.getParentClass = () => {
        if (!$scope.$parent.event.isPending) {
          return 'timi-slot-disabled';
        } else {
          return 'timi-slot'
        }
      };
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
