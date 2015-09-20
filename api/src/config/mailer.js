import Handlebars  from 'handlebars';
import Mailer      from 'hapi-mailer';
import Path        from 'path';

exports.options = {
  transport: {
    service: 'Gmail',
    auth: {
      user: 'our username',
      pass: 'our password'
    }
  },
  views: {
    engines: {
      html: {
        module: Handlebars.create(),
        path: Path.join(__dirname, 'email')
      }
    }
  }
};

exports.mailer = Mailer;
