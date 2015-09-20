import moment from 'moment';

export default ($scope, $location, $state) => {
  $scope.slots = [
    {
      start: moment().add(3, 'days').add(1, 'hours'),
      end: moment().add(3, 'days').add(2, 'hours')
    },
    {
      start: moment().add(5, 'days').add(1, 'hours'),
      end: moment().add(5, 'days').add(2, 'hours')
    },
    {
      start: moment().add(10, 'days').add(1, 'hours'),
      end: moment().add(10, 'days').add(3, 'hours')
    }
  ];

  $scope.viewParticipants = () => {
    $state.go('participants', { previous: 'invitation', eventId: 2 })
  };

  $scope.backToHome = () => {
    $state.go('home');
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

  $scope.notgoing = [
    {
      name: 'Nathan Azaria',
      url: 'http://cdn.playbuzz.com/cdn/a6264acf-e11e-4a83-8ac2-7986b637ed4d/5c92493e-654a-4b10-81f7-fc0d7c4ece11.jpg'
    }
  ];

  $scope.invited = [
    {
      name: 'Anthony Ganteng',
      url: 'http://vignette4.wikia.nocookie.net/animalcrossing/images/e/e3/Lion-013-2048x2048.jpg/revision/latest?cb=20130406213028'
    }
  ];

  $scope.going.header = 'Going';
  $scope.invited.header = 'Invited';
  $scope.isPending = false;
}
