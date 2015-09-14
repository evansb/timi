export default ($scope, $location) => {
  $scope.goToLogin = () => {
    $location.path('login');
  };
};
