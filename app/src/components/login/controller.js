
export default ($scope, $timi, $notification, $state) => {

  if ($timi.isLoggedIn()) {
    $location.path('home');
  }

  $scope.login = () => {
    $timi.Self.login({
      email: $scope.email,
      password: $scope.password
    }, (user) => {
      $timi.setActiveUser(user);
      $state.go('home');
    }, (err) => {
      let message = 'Invalid username/password';
      $notification.send({ type: 'modal', message: message});
    })
  };
}
