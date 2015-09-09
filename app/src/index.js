
import app      from './app';
import route    from './route';
import startup  from './startup';

app.config(route)   // Setup routes
  .run(startup)    // Initialize the app
