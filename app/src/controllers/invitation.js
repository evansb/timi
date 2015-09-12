
import moment from 'moment';

let InvitationController = ($scope) => {
  $scope.slots = [
    {
      start: moment().add(3, 'days').add(1, 'hours'),
      end: moment().add(3, 'days').add(2, 'hours')
    },
    {
      start: moment().add(5, 'days').add(1, 'hours'),
      end: moment().add(5, 'days').add(2, 'hours')
    },
    {
      start: moment().add(10, 'days').add(1, 'hours'),
      end: moment().add(10, 'days').add(3, 'hours')
    }
  ];
};

export default {
  name: 'InvitationController',
  fn: InvitationController
};
