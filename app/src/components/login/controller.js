
export default ($scope, $timi, $notification, $state, $auth, $http) => {
  if ($auth.isAuthenticated()) {
    $state.go('home');
  }

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

};
