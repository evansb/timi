
export default ($scope, $state) => {
  $scope.backToHome = () => {
      $state.go('home')
  };
}
