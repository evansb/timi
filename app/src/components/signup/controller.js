
export default ($scope, $timi, $notification) => {
  $scope.signup = () => {
    let newUser = new $timi.User({
      user: {
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      }
    });
    newUser.$save((user) => {
      $timi.setActiveUser(user);
      $location.path('/#/home');
    }, (err) => {
      if (err.status === 400) {
        let message = 'A user with that email already exists. Try login?';
        $notification.send({ type: 'modal', message: message});
      }
    });
  }
}
