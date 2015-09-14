let ModalNotificationController = ($scope, $ionicModal, $notification) => {
  $ionicModal.fromTemplateUrl(__dirname + '/modal-notification.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then((modal) => {
    $scope.modal = modal;
  });

  $scope.$on('newNotification', (o, notification) => {
    if (notification.type == 'modal') {
      $scope.message = notification.message;
      $scope.modal.show();
    }
  });

  $scope.close = () => {
    $scope.message = '';
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', () => $scope.modal.remove());

  // Execute action on hide modal
  $scope.$on('modal.hidden', () => {});

  // Execute action on remove modal
  $scope.$on('modal.removed', () => {});
}

export default { ModalNotificationController }
