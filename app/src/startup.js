
import _ from 'lodash';
import 'offline';

// Work which should be performed when the injector is done loading all modules.
export default function($ionicPlatform, $auth, $rootScope, $state, $window) {
  Offline.options = {
    checks: {xhr: {url: 'http://localhost:8000/api/status' }},
    checkOnLoad: true,
    interceptRequests: true,
    requests: true,
    game: false
  };
  let defaultStatusBar = () => {
      if (window.StatusBar) {
        StatusBar.styleDefault;
      }
  };
  let hideAccessoryBar = () => {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
  };
  $ionicPlatform.ready(() => {
    hideAccessoryBar();
    defaultStatusBar();
  });
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (!_.includes(['login', 'signup', 'forgot'], to.name) &&
          !$auth.isAuthenticated()) {
      e.preventDefault();
      $state.go('login');
    }
  });
}
