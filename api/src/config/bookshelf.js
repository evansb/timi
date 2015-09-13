import Bookshelf from 'bookshelf';

var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8'
  }
});

var bookshelf = Bookshelf(knex);
bookshelf.plugin('registry');
bookshelf.plugin('visibility');

module.exports = bookshelf;
