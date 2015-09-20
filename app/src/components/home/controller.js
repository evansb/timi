import _ from 'lodash';

export default ($scope, $state, $timi) => {
  let sample = {
    'name':'Date with Sharon',
    'deadline': '2020-02-10',
    'timeslots': [
      {
        'start': '2020-02-10',
        'end': '2020-02-11'
      },
      {
        'start': '2020-03-10',
        'end': '2020-03-11'
      }
    ],
    'participants': [1]
  };
  let login = () => {
    $timi.Self.login({
      email: 'vi@ana.com',
      password: 'irvin'
    }, () => { $timi.Event.create(sample); });
  };

  $timi.User.signup({
    name: 'Viana',
    email: 'vi@ana.com',
    password: 'irvin'
  }, () => login(), () => login());

  $scope.contexts = [
    { title: 'Invites', get () { return $scope.invites; } },
    { title: 'Scheduled', get () { return $scope.scheduled; } }
  ]
  $scope.goToCreate = () => {
    $state.go('create');
  };
  $scope.goToSetting = () => {
    $state.go('settings');
  };
  $scope.goToDetails = (event) => {
    $state.go('invitation', { eventId: 2 });
  };
  $scope.slideIndex = 0;
  $scope.slideChanged = (index) => {
    $scope.slideIndex = index;
  };

  (async () => {
    try {
      let myEvents = $timi.MyEvents.query(() => {
        $scope.invites = myEvents.map((event) => {
          event.isPending = true
          return event;
        });
      });
    } catch(err) {
      console.log(err);
    }
  })()

  $scope.invites = [];
  $scope.scheduled = [
      {
        title: 'Avengers Meeting',
        date: '24 September',
        timeStart: '15:30',
        timeEnd: '16:30',
        type: 'confirmed'
      },
      {
        title: 'Plan Colin (McRae)\'s Birthday',
        date: '21 April',
        timeStart: '10:10',
        timeEnd: '11:30',
        type: 'confirmed'
      },
      {
        title: 'Nala Mass Petting Event',
        date: '8 December',
        timeStart: '00:00',
        timeEnd: '23:59',
        type: 'confirmed'
      },
      {
        title: 'Avengers Meeting',
        date: '24 September',
        timeStart: '15:30',
        timeEnd: '16:30',
        type: 'confirmed'
      },
      {
        title: 'Plan Colin (McRae)\'s Birthday',
        date: '21 April',
        timeStart: '10:10',
        timeEnd: '11:30',
        type: 'confirmed'
      },
      {
        title: 'Nala Mass Petting Event',
        date: '8 December',
        timeStart: '00:00',
        timeEnd: '23:59',
        type: 'confirmed'
      },
    ];
}
