
export default ($scope, $location) => {
  $scope.backToHome = () => {
      $location.path('home')
  };  
}
