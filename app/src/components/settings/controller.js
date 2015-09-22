
export default ($scope, $state, $auth, $timi) => {
  $scope.backToHome = () => {
      $state.go('home')
  };

  $scope.logout = () => {
    $auth.logout();
    $state.go('login');
  };
}
