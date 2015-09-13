
export default ($scope, $timi) => {
  $scope.signup = () => {
    let newUser = new $timi.User({
      user: {
        email: $scope.email,
        password: $scope.password
      }
    });
    newUser.$save((user, response) => {
      console.log(response);
    });
  }
}
