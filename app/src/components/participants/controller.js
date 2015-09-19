export default ($scope, $stateParams, $state) => {
  $scope.back = () => {
    $state.go($stateParams.previous, { eventId: $stateParams.eventId });
  };

  $scope.going = [
    {
      name: 'Sharon Lynn',
      url: 'http://www.metalinjection.net/wp-content/uploads/2014/08/Giraffe-Tongue-Orchestra.jpg'
    },
    {
      name: 'Evan Sebastian',
      url: 'http://cdn.playbuzz.com/cdn/a6264acf-e11e-4a83-8ac2-7986b637ed4d/5c92493e-654a-4b10-81f7-fc0d7c4ece11.jpg'
    }
  ];
  $scope.going.header = 'Going';

  $scope.invited = [
    {
      name: 'Anthony Ganteng',
      url: 'http://vignette4.wikia.nocookie.net/animalcrossing/images/e/e3/Lion-013-2048x2048.jpg/revision/latest?cb=20130406213028'
    }
  ];
  $scope.invited.header = 'Invited';

  $scope.all = [$scope.going, $scope.invited];
}
