
import _ from 'lodash';

let directives = {};

let dashify = (str) => {
	return str.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase());
}

let elementDirective = (name) => {
  directives[name] = () => {
    return {
      restrict: 'E',
			transclude: true,
      templateUrl: __dirname + '/' + dashify(name) + '.html'
    };
  };
}

_.forEach([
  'timiEventCard',
  'timiEventHeader',
  'timiFullButton',
  'timiPersonCard',
  'timiSlotCard'], (name) => elementDirective(name));

export default directives;
