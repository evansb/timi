
export default ($scope, $notification, $state, $auth, $http) => {

  if ($auth.isAuthenticated()) {
    $state.go('home');
  }

  $scope.signup = async () => {
    if (!$scope.email) {
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
        let login = await $auth.login({
          email: $scope.email,
          password: $scope.password
        });
        $state.go('home');
      } catch(err) {
        if (err.status === 400) {
          let message = 'A user with that email already exists. try login?';
          $notification.send({ type: 'modal', message: message});
        }
      }
    }
  }
  
  $scope.loginGoogle = async () => {
    try {
      let user = await $auth.authenticate('google');
      $http.defaults.headers.common.Authorization = user.token;
      $state.go('home');
    } catch (err) {
      let message = 'Invalid username/password';
      $notification.send({ type: 'modal', message: message});
    }
  }

  $scope.$validationOptions = {
    displayOnlyLastErrorMsg: true
  };
}
