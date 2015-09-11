import bookshelf from 'bookshelf';

var knex = require('knex')({
  client: 'postgresql',
  connection: {
    host: '127.0.0.1',
    user: 'your_db_username',
    password: 'your_db_password',
    database: 'test',
    charset: 'utf8'
  }
});

module.exports = bookshelf(knex);
