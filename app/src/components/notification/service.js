let notifications = [];

export default function($rootScope) {
  this.send = (notification) => {
    notifications.push(notification);
    $rootScope.$broadcast('newNotification', notification);
  }
}
