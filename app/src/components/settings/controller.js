
export default ($scope, $state, $auth) => {
  $scope.backToHome = () => {
      $state.go('home')
  };

  $scope.logout = () => {
    $auth.logout();
    $state.go('login');
  };
}
