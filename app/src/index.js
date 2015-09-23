import 'babelify/polyfill';
import 'es6-shim';
import 'angular';
import 'angular-animate';
import 'angular-sanitize';
import 'angular-resource';
import 'angular-local-storage';
import 'angular-ui-router';
import 'satellizer';
import 'ionic';
import 'ionic-timepicker';
import 'ion-autocomplete';
import 'angular-translate';
import 'angular-translate-loader-static-files';
import 'angular-validation-ghiscoding';

import _              from 'lodash'
import startup        from './startup';
import common         from './common';
import components     from './components';

let app = angular.module('timi', [
  'ionic',
  'ionic-timepicker',
  'ion-autocomplete',
  'pascalprecht.translate',
  'ghiscoding.validation',
  'satellizer',
  'ngResource',
  'LocalStorageModule'
]);

app.config(($translateProvider) => {
  $translateProvider.useStaticFileLoader({
    prefix: '../bower_components/angular-validation-ghiscoding/locales/validation/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage('en').fallbackLanguage('en');
});

components.push(common);

// Require credentials for all request
app.config(($httpProvider, $authProvider) => {
  $authProvider.signupRedirect = '/home';  
  $authProvider.baseUrl = (window.location.hostname == 'localhost')?
    'http://localhost:8000/api': 'http://timiapp.me/api';
  $authProvider.loginUrl = '/me/login';
  $authProvider.signupUrl = '/users';
  $authProvider.unlinkUrl = '/me/logout';
  $httpProvider.defaults.withCredentials = true;
})

// Load all components
_.forEach(components, (component) => {
  _.forEach(component, (value, key) => {
    if (key.endsWith('Controller')) {
      app.controller(key, value);
    } else if (key.endsWith('Config')) {
      app.config(value);
    } else if (key.startsWith('$') || key.endsWith('Service')) {
      app.service(key, value);
    } else if (key.endsWith('Factory')) {
      app.factory(key, value);
    } else {
      app.directive(key, value);
    }
  });
});

// Initialize the app
app.run(startup)
