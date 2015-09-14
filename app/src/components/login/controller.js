
export default ($scope, $timi, $notification, $location) => {

  if ($timi.isLoggedIn()) {
    $location.path('home');
  }

  $scope.login = () => {
    $timi.Self.login({
      email: $scope.email,
      password: $scope.password
    }, (user) => {
      $timi.setActiveUser(user);
      $location.path('home');
    }, (err) => {
      let message = 'Invalid username/password';
      $notification.send({ type: 'modal', message: message});
    })
  };
}
