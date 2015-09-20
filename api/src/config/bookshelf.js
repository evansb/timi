import Bookshelf from 'bookshelf';

var knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8'
  }
});

var bookshelf = Bookshelf(knex);

bookshelf.plugin('virtuals');
bookshelf.plugin('registry');
bookshelf.plugin('visibility');

export default bookshelf;
