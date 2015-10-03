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
    deadline: $scope.newEvent.deadline || moment().add(1, 'days').startOf('days').valueOf()
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
      $scope.isError.deadline = $scope.newEvent.deadline < moment().valueOf();
      $scope.isError.title = $scope.newEvent.name.length <= 0 || $scope.newEvent.name.length > 30;
      if ($scope.isError.title == true || $scope.isError.deadline == true) return;
    } else if ($scope.step == 2) {
      $scope.isError.timeslots = $scope.newEvent.timeslots.length <= 0;
      if ($scope.newEvent.timeslots.length <= 0) return;
    } else if ($scope.step == 3) {
      console.log(_.keys($scope.newEvent.participants).length <= 0);
      $scope.isError.participants = _.keys($scope.newEvent.participants).length <= 0;
      if ($scope.isError.participants) return;
      $scope.createEvent();
    }
    $scope.step = Math.min($scope.step + 1, 4);
  }

  $scope.createEvent = () => {
    let ranges = _($scope.newEvent.timeslots).map(slotToRequest).flatten();
    let { name, deadline, participants, location, latitude, longitude,
      duration } = $scope.newEvent;
    let newEvent = {
      name: name,
      deadline: moment(deadline).toDate(),
      ranges: ranges,
      duration: duration,
      location: location,
      latitude: latitude,
      longitude: longitude,
      participants: _.map(participants, (par) => {
        return {
          id: par.id,
          registered: true,
          important: par.important || false
        };
      })
    };
    $timi.createEvent(newEvent);
  }

  $rootScope.$on('eventCreated', () => {
    localStorageService.remove('newEvent');
    $scope.newEvent = {};
    $scope.next();
  });

  $rootScope.$on('logout', () => {
    $scope.newEvent = {};
    localStorageService.remove('newEvent');
  });

  $scope.getUser = function(query) {
    return {
      users: $scope.users.filter((user) => {
        let nameSearch;
        if (user.name) {
          nameSearch = user.name.toLowerCase().search(query.toLowerCase()) != -1;
        }
        let emailSearch = user.email.toLowerCase().search(query.toLowerCase()) != -1;
        return nameSearch || emailSearch;
      }).map((user) => {
        return { id: user.id, info: user.name + ' <'+ user.email + '>'};
      })
    };
  };

  $scope.formatDate = (date) => moment(date).format('DD MMM');
  $scope.formatTime = (time) => moment(time).format('HH:mm');
  $scope.normalize = (time) => moment().startOf('day')
    .add(time, 'seconds').format('HH:mm');

  $scope.addTimeslot = function() {
    if ($scope.timepicker.invalid || $scope.datepicker.invalid) return;
    let slot = {
      dateStart: $scope.datepicker.startValue,
      dateEnd: $scope.datepicker.endValue,
      timeStart: $scope.timepicker.startValue,
      timeEnd: $scope.timepicker.endValue
    };
    $scope.newEvent.timeslots.unshift(slot);
    $scope.isError.timeslots = false;
  };

  $scope.removeTimeslot = function(slot) {
    _.remove($scope.newEvent.timeslots, (slot2) => slot2 == slot);
  };

  $scope.clearTimeslot = function() {
    $scope.newEvent.timeslots = [];
  };

  $scope.clickedMethod = function(callback) {
    $scope.isError.participants = false;
    if (!_.includes($scope.newEvent.participants, callback.item.id))
      $scope.newEvent.participants[callback.item.id] = callback.item;
  };

  $scope.backToHome = () => {
    $scope.step = 1;
    $state.go('home');
  };

  $scope.datepicker = {
    startValue: moment().startOf('tomorrow').add(1, 'day').valueOf(),
    endValue: moment().startOf('tomorrow').add(2, 'day').valueOf(),
    invalid: false
  };

  $scope.timepicker = {
    startValue: 3600 * 9,
    endValue: 3600 * 17,
    invalid: false
  };

  $scope.pickerInvalidMsg = '';
  let pickerCheck = () => {
    if($scope.datepicker.endValue < $scope.datepicker.startValue) {
      $scope.datepicker.invalid = true;
      $scope.pickerInvalidMsg = 'End date should be after start date.';
    } else {
      $scope.datepicker.invalid = false;
    }

    if ((moment($scope.datepicker.startValue).startOf('day').valueOf()+$scope.timepicker.startValue*1000) < moment().valueOf()) {
      $scope.timepicker.invalid = true;
      $scope.pickerInvalidMsg = 'Time has already passed.';
    } else if ($scope.timepicker.endValue < $scope.timepicker.startValue) {
      $scope.timepicker.invalid = true;
      $scope.pickerInvalidMsg = 'End time should be after start time.';
    } else if ($scope.timepicker.endValue - $scope.timepicker.startValue < $scope.timepickerDuration) {
      $scope.timepicker.invalid = true;
      $scope.pickerInvalidMsg = 'Start to end time should be larger than event duration.';
    } else {
      $scope.timepicker.invalid = false;
    }
  };

  $scope.datepickerStart = {
    titleLabel: 'Start Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.datepicker.startValue = val;
      if ($scope.datepicker.from < $scope.datepicker.startValue) {
        $scope.datepicker.endValue = $scope.datepicker.from = $scope.datepicker.startValue;
      }
      pickerCheck();
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
      pickerCheck();
    }
  };

  $scope.timepickerStart = {
    inputEpochTime: $scope.timepicker.startValue,
    titleLabel: 'Start Time',
    step: 5,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.startValue = val;
      pickerCheck();
    }
  };

  $scope.timepickerEnd = {
    inputEpochTime: $scope.timepicker.endValue,
    titleLabel: 'End Time',
    step: 5,
    setButtonType: 'button-energized',
    callback: function(val) {
      if(val == undefined) return;
      $scope.timepicker.endValue = val;
      pickerCheck();
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
    step: 10,
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

  $scope.initAutocomplete = function() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
        {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', function() {
      $scope.newEvent.latitude = autocomplete.getPlace().geometry.location.lat();
      $scope.newEvent.longitude = autocomplete.getPlace().geometry.location.lng();
      $scope.newEvent.location = autocomplete.getPlace().name;
    });
  }

  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
  $scope.geolocate = function() {
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
    let container = document.getElementsByClassName('pac-container');
    // disable ionic data tab
    angular.element(container).attr('data-tap-disabled', 'true');
    // leave input field if google-address-entry is selected
    angular.element(container).on("click", function(){
      document.getElementById('autocomplete').blur();
    });
  };

  $scope.isError = {
    deadline: false,
    title: false,
    timeslots: false,
    participants: false
  };

  $scope.checkIsValidTitle = (title) => {
    $scope.isError.title = $scope.newEvent.name.length <= 0;
    return $scope.isError.title;
  };
};
