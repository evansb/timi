import moment from 'moment';

export default ($scope, $state) => {
  $scope.step = 1;
  $scope.previous = () => $scope.step = Math.max($scope.step - 1, 1);
  $scope.next = () => $scope.step = Math.min($scope.step + 1, 3);

  $scope.user = "";
  $scope.users = [
    {
      name: 'Evan Sebastian',
      email: 'evansebastian@hehe.com'
    },
    {
      name: 'Sharon Lynn',
      email: 'sharonlynn@hehe.com'
    },
    {
      name: 'Patricia Wong',
      email: 'patriciawong@hehe.com'
    },
    {
      name: 'Liu Yang',
      email: 'liuyang@hehe.com'
    }
  ];

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

  $scope.participants = [
    {
      name: 'Evan Sebastian',
      email: 'evanlhoini@gmail.com'
    }
  ];
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
    callback: function(val) {
      $scope.datepicker.startValue = val;
      console.log(val);
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
    callback: function(val) {
      let valFormatted = moment().startOf('day').add(val, 'seconds').format('HH:mm');
      $scope.timepicker.endValue = valFormatted;
      if ($scope.timepicker.startValue &&
          (val < $scope.timepicker.startValue)){
        $scope.timepicker.endValid = false;
      }
    }
  };

  $scope.deadline ={
    date: null,
    time: null
  };

  $scope.datepickerDeadline = {
    titleLabel: 'Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    callback: function(val) {
      $scope.deadline.date = val;
    }
  };

  $scope.timepickerDeadline = {
    titleLabel: 'Time',
    step: 1,
    callback: function(val) {
      $scope.deadline.time = moment().startOf('day').add(val, 'seconds').format('HH:mm');
    }
  };
};
