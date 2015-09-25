import moment from 'moment';
import 'moment-range';
import _ from 'lodash';

export default ($scope, $state, $timi, $rootScope, localStorageService, $ionicPopup) => {
  $scope.step = 1;
  $scope.users = [];

  $scope.newEvent = localStorageService.get('newEvent') || {};
  $scope.newEvent = {
    name: $scope.newEvent.name || "",
    timeslots: $scope.newEvent.timeslots || [],
    duration: $scope.newEvent.duration || 3600000,
    participants: $scope.newEvent.participants || {},
    deadline: $scope.newEvent.deadline || moment().add(1, 'hours').startOf('hour').valueOf()
  };

  localStorageService.set('newEvent', $scope.newEvent);

  let normalize = (s) => {
    return moment().startOf('day').add(s, 'seconds').format('HH:mm');
  };

  let slotToRequest = (slot) => {
    let result = [];
    let range = moment.range(slot.dateStart, slot.dateEnd);
    range.by('days', date => {
      result.push({
        date: date.format('YYYY-MM-DD'),
        start: normalize(slot.timeStart),
        end: normalize(slot.timeEnd)
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
    if ($scope.step == 1) {
      if ($scope.newEvent.name.length <= 0 || $scope.isError.deadline == true) return;
    } else if ($scope.step == 2) {
      if ($scope.newEvent.timeslots.length <= 0) return;
    } else if ($scope.step == 3) {
      if ($scope.newEvent.participants.length <= 0) return;
      $scope.createEvent();
    }
    $scope.step = Math.min($scope.step + 1, 4);
  }

  $scope.createEvent = () => {
    let ranges = _($scope.newEvent.timeslots).map(slotToRequest).flatten();
    let { name, deadline, participants, latitude, longitude,
      duration } = $scope.newEvent;
    let newEvent = {
      name: name,
      deadline: moment(deadline).toDate(),
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
    $timi.createEvent(newEvent);
  }

  $rootScope.$on('eventCreated', () => {
    localStorageService.remove('newEvent');
    $scope.newEvent = {};
    $scope.next();
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
    $scope.newEvent.timeslots.unshift(slot);
  };

  $scope.removeTimeslot = function(slot) {
    console.log("Clicked");
    _.remove($scope.newEvent.timeslots, (slot2) => slot2 == slot);
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
    invalid: false
  };

  $scope.timepicker = {
    startValue: 3600 * 9,
    endValue: 3600 * 17,
    invalid: false
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
    inputEpochTime: $scope.timepicker.startValue,
    titleLabel: 'Start Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.startValue = val;

      $scope.timepicker.invalid = $scope.timepicker.endValue < $scope.timepicker.startValue &&
                                  $scope.timepicker.endValue - $scope.timepicker.startValue < $scope.timepickerDuration;
    }
  };

  $scope.timepickerEnd = {
    inputEpochTime: $scope.timepicker.endValue,
    titleLabel: 'End Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.endValue = val;

      console.log($scope.timepicker);
      $scope.timepicker.invalid = $scope.timepicker.endValue < $scope.timepicker.startValue &&
                                  $scope.timepicker.endValue - $scope.timepicker.startValue < $scope.timepickerDuration;
    }
  };

  $scope.datepickerDeadline = {
    titleLabel: 'Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      if (val === undefined) return;
      let timePart = moment($scope.newEvent.deadline).valueOf() -
        (+moment($scope.newEvent.deadline).startOf('day').valueOf());
      $scope.newEvent.deadline = moment(val).valueOf() + timePart;

      $scope.isError.deadline = $scope.newEvent.deadline < moment().valueOf();
    }
  };

  $scope.timepickerDeadline = {
    inputEpochTime: ((new Date()).getHours() + 1) * 3600,
    titleLabel: 'Time',
    step: 1,
    setButtonType: 'button-energized',
    callback: function(val) {
      if (val === undefined) return;
      let dayPart = (+moment($scope.newEvent.deadline).startOf('day'));
      $scope.newEvent.deadline = dayPart + (val * 1000);

      console.log($scope.newEvent.deadline);
      console.log(moment().valueOf());
      $scope.isError.deadline = $scope.newEvent.deadline < moment().valueOf();
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
    inputEpochTime: 3600,
    titleLabel: 'Duration',
    step: 5,
    setButtonType: 'button-energized',
    callback: function(val) {
      if (val === undefined) return;
      $scope.newEvent.duration = val * 1000;
    }
  };

  $scope.displayDuration = val => {
    return moment().startOf('day').add(val, 'milliseconds').format('HH [h] mm [min]');
  }

  //Location Autocomplete
  $scope.autocompleteOnFocus = 'false';
  $scope.autocompleteOnBlur = () => {
    setTimeout(() => {
      $scope.toggleAutocompleteOnFocus('false');
      $scope.$apply();
    },
    21);
  };
  $scope.toggleAutocompleteOnFocus = (status) => {
    $scope.autocompleteOnFocus = status;
  };

  let placeSearch, autocomplete;

  let initAutocomplete = () => {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', () => {
      $scope.newEvent.latitude = autocomplete.getPlace().geometry.location.lat();
      $scope.newEvent.longitude = autocomplete.getPlace().geometry.location.lng();
      $scope.newEvent.location = autocomplete.getPlace().name;
    });
  }

  initAutocomplete();

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  $scope.geolocate = () => {
    $scope.toggleAutocompleteOnFocus('true');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  };

  $scope.isError = {
    deadline: false
  };
};
