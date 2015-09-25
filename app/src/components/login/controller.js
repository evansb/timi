
export default ($scope, $timi, $notification, $state, $auth, $http, $Offline) => {
  if ($auth.isAuthenticated()) {
    $state.go('home');
  }

  $scope.loginEnabled = ($Offline.state == 'up');

  $Offline.on('up', () => { $scope.loginEnabled = true; })
  $Offline.on('down', () => {
    $scope.loginEnabled = false;
    console.log("Down");
  })

  $scope.login = async () => {
    try {
      let user = await $auth.login({
        email: $scope.email,
        password: $scope.password
      });
      $http.defaults.headers.common.Authorization = user.token;
      $state.go('home');
    } catch (err) {
      let message = 'Invalid username/password';
      $notification.send({ type: 'modal', message: message});
    }
  };

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
};
