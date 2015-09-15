import 'es6-shim';
import 'angular';
import 'angular-animate';
import 'angular-sanitize';
import 'angular-resource';
import 'angular-ui-router';
import 'ionic';
import 'ionic-datepicker';
import 'ionic-timepicker';

import _              from 'lodash'
import startup        from './startup';
import common         from './common';
import components     from './components';

let app = angular.module('timi', [
  'ionic',
  'ionic-datepicker',
  'ionic-timepicker',
  'ngResource'
]);

components.push(common);

// Load all components
_.forEach(components, (component) => {
  _.forEach(component, (value, key) => {
    if (key.endsWith('Controller')) {
      app.controller(key, value);
    } else if (key.endsWith('Config')) {
      app.config(value);
    } else if (key.startsWith('$')) {
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
