import app          from './app';
import route        from './route';
import startup      from './startup';
import directives   from './directives';
import controllers  from './controllers';
import services     from './services';

// Setup routes
app.config(route)

// Load Services
services.forEach((service) => {
  app.service(service.name, service.fn);
});

// Load Controllers
controllers.forEach((service) => {
  app.controller(controller.name, controller.fn);
});

// Load Directives
directives.forEach((service) => {
  app.directive(directive.name, directive.fn);
});

// Initialize the app
app.run(startup)
