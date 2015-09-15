export default ($scope, $location) => {
  $scope.goToLogin = () => {
    $location.path('login').search('forgot', $scope.email);
  };
};
