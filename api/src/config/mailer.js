import Handlebars  from 'handlebars';
import Mailer      from 'hapi-mailer';
import Path        from 'path';

exports.options = {
  transport: {
    service: 'Gmail',
    auth: {
      user: 'timiapp.me@gmail.com',
      pass: 'timiopensesame'
    }
  },
  views: {
    engines: {
      html: {
        module: Handlebars.create(),
        path: Path.join(__dirname, '../../src/email')
      }
    }
  }
};

exports.mailer = Mailer;
