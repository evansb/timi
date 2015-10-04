
export default ($scope, $state, $auth, $timi, $rootScope, $ionicPopup, $notification) => {
  $scope.user = {};

  $scope.backToHome = () => {
    $state.go('home')
  };

  $rootScope.$on('meFetched', (e, me) => {
    $scope.user = me;
    $scope.previousLink = me.nusmods;
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
      let user = {
        id: $scope.user.id,
        nusmods: res
      };
      $timi.Self.update(user, (response) => {
        $timi.getActiveUser();
        $scope.user.nusmods = response.nusmods || "";
      }, (e) => {
        if (e.status == 400) {
          $notification.showPopup('Invalid NUSMods short link');
          $scope.user.nusmods = $scope.previousLink;
        }
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
