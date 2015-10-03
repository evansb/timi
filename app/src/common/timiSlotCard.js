
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
        console.log(da);
        let date = moment(da);
        return date.format('dddd').toUpperCase();
      };
      $scope.hourMinute = (date) => moment(date).format('hh:mm');
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
