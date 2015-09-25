import 'babelify/polyfill';
import 'es6-shim';
import 'angular';
import 'angular-animate';
import 'angular-sanitize';
import 'angular-resource';
import 'angular-local-storage';
import 'angular-ui-router';
import 'satellizer';
import 'offline';
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

let statusUrl = (window.location.hostname == 'localhost')?
  'http://localhost:8000/api/status': 'http://timiapp.me/api/status';

Offline.options = {
  checks: {xhr: {url: statusUrl }},
  checkOnLoad: true,
  interceptRequests: true,
  requests: true,
  game: false
};

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

app.service('$Offline', function() { return Offline; });

app.config(function ($translateProvider) {
  window.setInterval(() => Offline.check(), 2000);

  $translateProvider.useStaticFilesLoader({
    prefix: '/bower_components/angular-validation-ghiscoding/locales/validation/',
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
  $authProvider.google({
    clientId: '489077244467-j10hj8t8l225omb1juj0vrs6ef8657n4.apps.googleusercontent.com'
  });
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
