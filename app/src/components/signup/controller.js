
export default ($scope, $notification, $state, $auth, $http, $Offline) => {

  if ($auth.isAuthenticated()) {
    $state.go('home');
  }

  $scope.isOnline = true;

  $Offline.on('up', () => {
    $scope.isOnline = true;
    $scope.$apply();
  });

  $Offline.on('down', () => {
    $scope.isOnline = false;
    $scope.$apply();
  });

  $scope.signup = async () => {
    if (!$scope.isOnline) { $Offline.showPopup(); return; }

    if (!$scope.email) {
      return;
      //$notification.showPopup('Please type in valid email');
    } else if (!$scope.password || $scope.password.length < 8 || $scope.password.length > 30) {
      return;
      //$notification.showPopup('Password must be at least 8 characters and at most 30 characters');
    } else if (!$scope.name || $scope.name.length > 30){
      return;
      //$notification.showPopup('Name is required and must be at most 30 characters');
    } else if (!$scope.passwordConfirm || $scope.passwordConfirm !== $scope.password) {
      return;
      $scope.mismatch = true;
      //$notification.showPopup('Password confirmation mismatch');
    } else {
      try {
        let user = await $auth.signup({
          email: $scope.email,
          name: $scope.name,
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
          $notification.showPopup('A user with that email already exists. try login?');
        }
      }
    }
  }

  $scope.loginGoogle = async () => {
    if (!$scope.isOnline) { $Offline.showPopup(); return; }
    let user = await $auth.authenticate('google');
    $http.defaults.headers.common.Authorization = user.token;
    $state.go('home');
  }

  $scope.$validationOptions = {
    displayOnlyLastErrorMsg: true
  };
}
