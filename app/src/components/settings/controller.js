
export default ($scope, $state, $auth, $timi, $rootScope, $ionicPopup) => {
  $scope.user = {};

  $scope.backToHome = () => {
    $state.go('home')
  };

  $rootScope.$on('meFetched', (e, me) => {
    $scope.user = me;
  });

  $scope.showNUSModsDialog = function() {
    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="user.nusmods">',
      title: 'Enter new NUSMods Short Link',
      subTitle: 'Go to nusmods.com to generate your short link',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            return $scope.user.nusmods;
          }
        }
      ]
    });
    myPopup.then((res) => {
      $scope.user.nusmods = res;
      $timi.updateUser({
        id: $scope.user.id,
        nusmods: $scope.user.nusmods
      });
    });
  };

  $scope.logout = () => {
    $rootScope.$broadcast('logout');
    $auth.logout();
    $state.go('login');
  };

  $timi.getActiveUser();
}
