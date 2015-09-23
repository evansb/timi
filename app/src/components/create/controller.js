import moment from 'moment';
import 'moment-range';
import _ from 'lodash';

export default ($scope, $state, $timi, $rootScope, localStorageService) => {
  $scope.step = 1;
  $scope.users = [];

  $scope.newEvent = localStorageService.get('newEvent') || {};
  $scope.newEvent = {
    name: $scope.newEvent.name || "",
    timeslots: $scope.newEvent.timeslots || [],
    duration: $scope.newEvent.duration || 3600000,
    participants: $scope.newEvent.participants || {},
    deadline: $scope.newEvent.deadline || moment().startOf('tomorrow').valueOf()
  };

  let slotToRequest = (slot) => {
    let result = [];
    let range = moment.range(slot.dateStart, slot.dateEnd);
    range.by('days', date => {
      result.push({
        date: date,
        start: slot.timeStart * 1000,
        end: slot.timeEnd * 1000
      });
    });
    return result;
  }

  // Save progress to Local Storage
  let save = () => {
    localStorageService.set('newEvent', $scope.newEvent);
  };

  $scope.previous = () => {
    save();
    $scope.step = Math.max($scope.step - 1, 1);
  }

  $scope.next = () => {
    save();
    if ($scope.step == 2) {
      $scope.createEvent();
    } else {
      $scope.step = Math.min($scope.step + 1, 3);
    }
  }

  $scope.createEvent = () => {
    let ranges = _($scope.newEvent.timeslots).map(slotToRequest).flatten();
    let { name, deadline, participants, latitude, longitude,
      duration } = $scope.newEvent;
    let newEvent = {
      name: name,
      deadline: moment(deadline).toDate().toString(),
      ranges: ranges,
      duration: duration,
      participants: _.map(participants, (par) => {
        return {
          id: par.id,
          registered: true,
          important: par.important || false
        };
      }),
      latitude: 0.0,
      longitude: 0.0
    };
    console.log(newEvent);
    $timi.createEvent(newEvent);
  }

  $rootScope.$on('eventCreated', () => {
    localStorageService.remove('newEvent');
    $scope.newEvent = {};
    $scope.backToHome();
  });

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

  $scope.formatDate = (date) => moment(date).format('DD MMM');
  $scope.formatTime = (time) => moment(time).format('HH:mm');
  $scope.normalize = (time) => moment().startOf('day')
    .add(time, 'seconds').format('HH:mm');
  $scope.addTimeslot = function() {
    let slot = {
      dateStart: $scope.datepicker.startValue,
      dateEnd: $scope.datepicker.endValue,
      timeStart: $scope.timepicker.startValue,
      timeEnd: $scope.timepicker.endValue
    };
    $scope.newEvent.timeslots.push(slot);
    console.log($scope.newEvent.timeslots);
  };

  $scope.clearTimeslot = function() {
    $scope.newEvent.timeslots = [];
  };

  $scope.clickedMethod = function(callback) {
    if (!_.includes($scope.newEvent.participants, callback.item.id))
      $scope.newEvent.participants[callback.item.id] = callback.item;
  };

  $scope.backToHome = () => {
    $scope.step = 1;
    $state.go('home');
  };

  $scope.datepicker = {
    startValue: moment().startOf('tomorrow').valueOf(),
    endValue: moment().startOf('tomorrow').add(1, 'day').valueOf(),
    endValid: true
  };

  $scope.timepicker = {
    startValue: 3600 * 9,
    endValue: 3600 * 17,
    endValid: true
  };

  $scope.datepickerStart = {
    titleLabel: 'Start Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.datepicker.startValue = val;
    }
  };

  $scope.datepickerEnd = {
    titleLabel: 'End Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.datepicker.endValue = val;
    }
  };

  $scope.timepickerStart = {
    titleLabel: 'Start Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.startValue = val;
    }
  };

  $scope.timepickerEnd = {
    titleLabel: 'End Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.endValue = val;
    }
  };

  $scope.datepickerDeadline = {
    titleLabel: 'Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      let timePart = moment($scope.newEvent.deadline).valueOf() -
        (+moment($scope.newEvent.deadline).startOf('day').valueOf());
      $scope.newEvent.deadline = moment(val).valueOf() + timePart;
      console.log($scope.newEvent.deadline);
    }
  };

  $scope.timepickerDeadline = {
    titleLabel: 'Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      let dayPart = (+moment($scope.newEvent.deadline).startOf('day'));
      $scope.deadline = dayPart + (val * 1000);
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

  $scope.timepickerDuration = {
    titleLabel: 'Duration',
    step: 5,
    setButtonType: 'button-energized',
    callback: function(val) {
      $scope.newEvent.duration = val * 1000;
    }
  };

  $scope.displayDuration = val => {
    return moment().startOf('day').add(val, 'milliseconds').format('HH [h] mm [min]');
  }
};
