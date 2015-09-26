let notifications = [];

export default function($rootScope, $ionicPopup) {
  this.send = (notification) => {
    notifications.push(notification);
    $rootScope.$broadcast('newNotification', notification);
  };
  this.showPopup = (title, message) => {
    $ionicPopup.alert({ title, message });
  }
}
