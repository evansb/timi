export default ($scope, $location) => {
  $scope.goToLogin = () => {
    $state.go('login', { forgot: $scope.email });
  };
};
