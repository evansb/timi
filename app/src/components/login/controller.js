
export default ($scope, $timi, $notification, $state, $auth, $http,
$Offline) => {
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

  $scope.login = async () => {
    if ($scope.isOnline) {
      try {
        let user = await $auth.login({
          email: $scope.email,
          password: $scope.password
        });
        $http.defaults.headers.common.Authorization = user.token;
        $state.go('home');
      } catch (err) {
        console.log("here");
        $notification.showPopup('Invalid username/password', 'Please try again');
      }
    } else {
      $Offline.showPopup();
    }
  };

  $scope.loginGoogle = async () => {
    if ($scope.isOnline) {
      try {
        let user = await $auth.authenticate('google');
        $http.defaults.headers.common.Authorization = user.token;
        $state.go('home');
      } catch (err) {
        $notification.showPopup('Invalid username/password', 'Please try again');
      }
    } else {
      $Offline.showPopup();
    }
  }

  $scope.$validationOptions = {
    displayOnlyLastErrorMsg: true
  };
};
