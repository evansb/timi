import validator from 'validator'

export default ($scope, $notification, $state, $auth) => {

  if ($auth.isAuthenticated()) {
    $state.go('home');
  }

  $scope.signup = async () => {
    if (!validator.isEmail($scope.email)) {
      let message = 'Invalid email address';
      $notification.send({ type: 'modal', message: message});
    } else if ($scope.password && $scope.password.length < 4) {
      let message = 'Password must be at least 4 characters';
      $notification.send({ type: 'modal', message: message});
    } else {
      try {
        let user = await $auth.signup({
          email: $scope.email,
          password: $scope.password
        });
        $http.defaults.headers.common.Authorization = user.token;
      } catch(err) {
        if (err.status === 400) {
          let message = 'A user with that email already exists. try login?';
          $notification.send({ type: 'modal', message: message});
        }
      }
    }
  }
}
