
import moment from 'moment';

export default function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: function($scope) {
      $scope.parseDate = (date) => {
        return moment(date).fromNow();
      }
    },
    templateUrl: __dirname + '/timi-event-card.html'
  };
}
