
import moment from 'moment';

export default function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: function($scope) {
      $scope.parseDate = (date) => {
        if (moment($scope.event.deadline).diff(moment()) > 0) {
          return 'Respond ' + moment(date).fromNow();
        } else {
          return moment(date).fromNow();
        }
      }
    },
    templateUrl: __dirname + '/timi-event-card.html'
  };
}
