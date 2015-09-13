export default ($scope) => {
  $scope.step = 1;
  $scope.previous = () => $scope.step = Math.max($scope.step - 1, 1);
  $scope.next = () => $scope.step = Math.min($scope.step + 1, 3);
  $scope.participants = [
    {
      name: 'Evan Sebastian',
      email: 'evanlhoini@gmail.com'
    }
  ];
};
