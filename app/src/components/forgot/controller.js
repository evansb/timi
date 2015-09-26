export default ($scope, $state, $Offline) => {
  $scope.isOnline = true;

  $Offline.on('up', () => {
    $scope.isOnline = true;
    $scope.$apply();
  });

  $Offline.on('down', () => {
    $scope.isOnline = false;
    $scope.$apply();
  });

  $scope.goToLogin = () => {
    $state.go('login', { forgot: $scope.email });
  };
};
