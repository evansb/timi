
export default ($scope, $timi, $notification, $location) => {
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

  $scope.logout = () => {
    $timi.Self.logout(() => {
      console.log('logged_out!');
    })
  };
}
