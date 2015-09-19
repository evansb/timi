import validator from 'validator'

export default ($scope, $timi, $notification, $state) => {

  if ($timi.isLoggedIn()) {
    $location.path('home');
  }

  $scope.signup = () => {
    if (!validator.isEmail($scope.email)) {
      let message = 'Invalid email address';
      $notification.send({ type: 'modal', message: message});
    } else if (!validator.isByteLength($scope.password, 3, 30)) {
      let message = 'Password must be 3-30 characters';
      $notification.send({ type: 'modal', message: message});
    } else {
      let newUser = new $timi.User.signup({
        email: $scope.email,
        password: $scope.password
      });
      newUser.$save((user) => {
        $timi.setActiveUser(user);
        $state.go('home');
      }, (err) => {
        if (err.status === 400) {
          let message = 'a user with that email already exists. try login?';
          $notification.send({ type: 'modal', message: message});
        }
      });
    }
  }
}
