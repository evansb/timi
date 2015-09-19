export default ($scope, $state) => {
  $scope.goToLogin = () => {
    $state.go('login', { forgot: $scope.email });
  };
};
