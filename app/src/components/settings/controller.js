
export default ($scope, $state, $auth, $timi, $rootScope) => {
  $scope.user = {};

  $scope.backToHome = () => {
      $state.go('home')
  };

  $rootScope.$on('meFetched', (e, me) => {
    $scope.user = me;
  });

  $scope.logout = () => {
    $auth.logout();
    $state.go('login');
  };

  $timi.getActiveUser();
}
