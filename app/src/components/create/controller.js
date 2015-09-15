import moment from 'moment';

export default ($scope, $location) => {
  $scope.step = 1;
  $scope.previous = () => $scope.step = Math.max($scope.step - 1, 1);
  $scope.next = () => $scope.step = Math.min($scope.step + 1, 3);
  $scope.participants = [
    {
      name: 'Evan Sebastian',
      email: 'evanlhoini@gmail.com'
    }
  ];
  $scope.backToHome = () => {
    $scope.step = 1;
    $location.path('home');
  };

  $scope.datepickerEndValue = null;
  $scope.datepickerStartValue = null;
  $scope.datepickerEndValid = true;

  $scope.datepickerStart = {
    titleLabel: 'Start Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    callback: function(val) {
      $scope.datepickerStartValue = val;
      console.log(val);
      if ($scope.datepickerEndValue == null){
        $scope.datepickerEnd.from = val;
      } else if ($scope.datepickerEndValue < val) {
        $scope.datepickerEnd.from = val;
      }
    }
  };

  $scope.datepickerEnd = {
    titleLabel: 'End Date',
    from: moment().subtract(1, 'days').toDate(),
    to: moment().add(5, 'years').toDate(),
    callback: function(val) {
      $scope.datepickerEndValue = val;
      if ($scope.datepickerStartValue &&
          (val < $scope.datepickerStartValue)){
        $scope.datepickerEndValid = false;
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
    callback: (val) => {
      $scope.timepicker.startValue = val;
      console.log(val);
      if ($scope.timepicker.endValue == null){
        $scope.timepickerEnd.from = val;
      } else if ($scope.timepicker.endValue < val) {
        $scope.timepickerEnd.from = val;
      }
    }
  };

  $scope.timepickerEnd = {
    titleLabel: 'End Time',
    callback: (val) => {
      $scope.timepicker.endValue = val;
      if ($scope.timepicker.startValue &&
          (val < $scope.timepicker.startValue)){
        $scope.timepicker.endValid = false;
      }
    }
  };

};
