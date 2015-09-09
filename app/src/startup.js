
// Work which should be performed when the injector is done loading all modules.
export default function($ionicPlatform) {
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
}
