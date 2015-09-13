export default ($scope, $ionicModal) => {
  $ionicModal.fromTemplateUrl(__dirname + '/messageModal.html', {
    scope: $scope,
    animation: 'slide-in-down'
  }).then((modal) => {
    $scope.modal = modal;
  });

  $scope.openModal = () => {
    $scope.modal.show();
  };

  $scope.closeModal = () => {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', () => $scope.modal.remove());

  // Execute action on hide modal
  $scope.$on('modal.hidden', () => {});

  // Execute action on remove modal
  $scope.$on('modal.removed', () => {});
}
