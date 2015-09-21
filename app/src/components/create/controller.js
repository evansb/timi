import moment from 'moment';
import _ from 'lodash';

export default ($scope, $state, $timi, localStorageService) => {
  let save = () => {
    let h = moment($scope.deadline.time).get('hour');
    let m = moment($scope.deadline.time).get('minute');
    $scope.newEvent.rawDeadline = $scope.deadline;
    console.log($scope.deadline.date);
    $scope.newEvent.deadline = moment($scope.deadline.date)
      .add(h, 'hours').add(m, 'minutes').toDate().toString();
    console.log($scope.newEvent.deadline);
    $scope.newEvent.participants = $scope.participants;
    localStorageService.set('newEvent', $scope.newEvent);
  };
  $scope.newEvent = localStorageService.get('newEvent') || {};
  $scope.step = 1;
  $scope.previous = () => {
    save();
    $scope.step = Math.max($scope.step - 1, 1);
  }
  $scope.next = () => {
    if ($scope.step == 2) {
      save();
      (async () => {
        try {
          let { name, deadline, participants, location } = $scope.newEvent;
          $timi.Event.create({
            name: name,
            deadline: deadline,
            participants: _.map(participants, (par) => par.id),
            location: location,
            timeslots: [{
              start: deadline,
              end: moment(deadline).add(2, 'hours').toDate().toString()
            }]
          }, () => $scope.step = Math.min($scope.step + 1, 3));
        } catch(err) {
          console.log(err);
        }
      })();
    } else {
      save();
      $scope.step = Math.min($scope.step + 1, 3);
    }
  }

  $scope.users = [];

  $scope.getUser = function(query) {
    return {
      users: $scope.users.filter((user) => {
        return (user.name.toLowerCase()
          .search(query.toLowerCase()) != -1) ||
          (user.email.toLowerCase()
          .search(query.toLowerCase()) != -1);
      })
    };
  };

  $scope.clickedMethod = function(callback) {
    if (!_.includes($scope.participants, callback.item.id))
      $scope.participants.push(callback.item);
  };

  $scope.participants = $scope.newEvent? ($scope.newEvent.participants || []) : [];

  $scope.backToHome = () => {
    $scope.step = 1;
    $state.go('home');
  };

  $scope.datepicker = {
    endValue: null,
    startValue: null,
    endValid: true
  };

  $scope.datepickerStart = {
    titleLabel: 'Start Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.datepicker.startValue = val;
      if ($scope.datepicker.endValue == null){
        $scope.datepickerEnd.from = val;
      } else if ($scope.datepicker.endValue < val) {
        $scope.datepickerEnd.from = val;
      }
    }
  };

  $scope.datepickerEnd = {
    titleLabel: 'End Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.datepicker.endValue = val;
      if ($scope.datepicker.startValue &&
          (val < $scope.datepicker.startValue)){
        $scope.datepicker.endValid = false;
      }
    }
  };

  $scope.timepicker = {
    endValue: null,
    startValue: null,
    endValid: true
  };

  $scope.timepickerStart = {
    titleLabel: 'Start Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      let valFormatted = moment().startOf('day').add(val, 'seconds').format('HH:mm');
      $scope.timepicker.startValue = valFormatted;
      if ($scope.timepicker.endValue == null){
        $scope.timepickerEnd.from = valFormatted;
      } else if ($scope.timepicker.endValue < val) {
        $scope.timepickerEnd.from = valFormatted;
      }
    }
  };

  $scope.timepickerEnd = {
    titleLabel: 'End Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      let valFormatted = moment().startOf('day').add(val, 'seconds').format('HH:mm');
      $scope.timepicker.endValue = valFormatted;
      if ($scope.timepicker.startValue &&
          (val < $scope.timepicker.startValue)){
        $scope.timepicker.endValid = false;
      }
    }
  };

  $scope.deadline = $scope.newEvent.rawDeadline || {
    date: null,
    time: null
  };

  $scope.datepickerDeadline = {
    titleLabel: 'Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.deadline.date = val;
    }
  };

  $scope.timepickerDeadline = {
    titleLabel: 'Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.deadline.time = moment().startOf('day').add(val, 'seconds').format('HH:mm');
    }
  };

  (async () => {
    try {
      let users = $timi.User.query(() => {
        $scope.users = users;
      });
    } catch(err) {
      console.log(err);
    }
  })();

  $scope.duration = {
    time: null
  };

  $scope.timepickerDuration = {
    titleLabel: 'Duration',
    step: 5,
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.duration.time = moment().startOf('day').add(val, 'seconds').format('HH [h] mm [min]');
    }
  };
};
