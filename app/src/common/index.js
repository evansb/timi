
import _ 				from 'lodash';
import $timi from './timi';

let directives = {
	timiEventCard: () => {
	  return {
	    restrict: 'E',
	    templateUrl: __dirname + '/timi-event-card.html'
	  };
	},
	timiEventHeader: () => {
	  return {
	    restrict: 'E',
	    templateUrl: __dirname + '/timi-event-header.html'
	  };
	},
	timiPersonCard: () => {
	  return {
	    restrict: 'E',
	    templateUrl: __dirname + '/timi-person-card.html'
	  };
	},
	timiSlotCard: () => {
	  return {
	    restrict: 'E',
	    templateUrl: __dirname + '/timi-slot-card.html'
	  };
	},
	timiFullButton: () => {
	  return {
	    restrict: 'E',
	    templateUrl: __dirname + '/timi-full-button.html',
			transclude: true,
			scope: {
				color: '@',
				type: '@'
			}
	  };
	}
};

let services = { $timi };

let controllers = {};

export default _.assign(directives, _.assign(services, controllers));
